import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseSync } from "oxc-parser";

const root = path.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const out = path.join(root, "r");
const registryName = "cipher";
const baseItemName = "cipher-base";
const installRoot = "src/components/v4";
const registryItem = (name: string) => "@" + registryName + "/" + name;
const failures: string[] = [];

const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const versions: Record<string, string> = {
  ...manifest.peerDependencies,
  ...manifest.dependencies,
  ...manifest.devDependencies
};
const declaredPackage = (name: string) => {
  const version = versions[name];
  if (!version) failures.push("Undeclared runtime dependency: " + name);
  return version ? name + "@" + version : name;
};
const packageName = (specifier: string) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

const filesIn = (folder: string): string[] =>
  readdirSync(path.join(root, folder), { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(folder + "/" + entry.name) : [folder + "/" + entry.name]
  );
const read = (file: string) => readFileSync(path.join(root, file), "utf8");
const localFile = (from: string, specifier: string) => {
  if (!specifier.startsWith(".")) return undefined;
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier));
  return [base, base + ".ts", base + ".tsx", base + ".json", base + "/index.ts", base + "/index.tsx"].find(
    (file) => existsSync(path.join(root, file)) && !file.endsWith("/")
  );
};
const importsFrom = (file: string): string[] => {
  if (file.endsWith(".css"))
    return [...read(file).matchAll(/@(?:import|reference)\s+["']([^"']+)["']/g)].map((match) => match[1]);
  if (!/\.tsx?$/.test(file)) return [];
  const result = parseSync(file, read(file));
  if (result.errors.length) throw new Error(file + " does not parse");
  return result.program.body.flatMap((statement) =>
    (statement.type === "ImportDeclaration" ||
      statement.type === "ExportNamedDeclaration" ||
      statement.type === "ExportAllDeclaration") &&
    statement.source
      ? [statement.source.value]
      : []
  );
};
const portable = (file: string) => {
  const text = read(file);
  if (!file.endsWith(".css")) return text;
  return text.replace(/url\(["']?([^"')]+\.woff2)["']?\)/g, (_match, font) => {
    const data = readFileSync(path.resolve(root, path.dirname(file), font)).toString("base64");
    return 'url("data:font/woff2;base64,' + data + '")';
  });
};

const isTest = (file: string) => /\.(test|spec)\.tsx?$/.test(file);
const knownModules = new Set(
  ["src/ui", "src/patterns"]
    .flatMap(filesIn)
    .filter((file) => file.endsWith(".tsx") && !isTest(file))
);
const packageOnly = ["src/env.d.ts", "src/styles.ts"];
const support = filesIn("src").filter(
  (file) =>
    !file.startsWith("src/ui/") &&
    !file.startsWith("src/patterns/") &&
    !isTest(file) &&
    !file.endsWith(".woff2") &&
    !packageOnly.includes(file)
);
const baseFiles = support;
const fileEntry = (file: string) => {
  const target = installRoot + "/" + file.slice("src/".length);
  return { path: target, type: "registry:file", target };
};

const baseDependencies = new Set(["tailwindcss", "tw-animate-css"]);
baseFiles.forEach((file) =>
  importsFrom(file).forEach((specifier) => {
    const local = localFile(file, specifier);
    if (local && !baseFiles.includes(local))
      failures.push("Base support import is not shipped in base: " + file + " -> " + local);
    else if (!local && specifier.startsWith("."))
      failures.push("Unresolved support import: " + file + " -> " + specifier);
    else if (!local && !["react", "react-dom"].includes(packageName(specifier)))
      baseDependencies.add(packageName(specifier));
  })
);

type Item = {
  name: string;
  type: string;
  description?: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files: string[];
};
const items: Item[] = [
  {
    name: baseItemName,
    type: "registry:base",
    description:
      "Cipher tokens, the Lightly Peach, Light and Dark themes, fonts, cn and scoped portal support.",
    dependencies: [...baseDependencies].sort().map(declaredPackage),
    files: baseFiles
  }
];
[...knownModules].sort().forEach((file) => {
  const name = path.basename(file, ".tsx");
  const dependencies = new Set<string>();
  const registryDependencies = new Set([registryItem(baseItemName)]);
  const extras = new Set<string>();
  const scanned = new Set<string>();
  const collect = (current: string) => {
    if (scanned.has(current)) return;
    scanned.add(current);
    importsFrom(current).forEach((specifier) => {
      const local = localFile(current, specifier);
      if (local) {
        if (knownModules.has(local)) {
          const dependency = path.basename(local, ".tsx");
          if (dependency !== name) registryDependencies.add(registryItem(dependency));
        } else if (!support.includes(local)) {
          extras.add(local);
          collect(local);
        }
      } else if (specifier.startsWith(".")) failures.push("Unresolved local import: " + current + " -> " + specifier);
      else if (!["react", "react-dom"].includes(packageName(specifier))) dependencies.add(packageName(specifier));
    });
  };
  collect(file);
  items.push({
    name,
    type: file.startsWith("src/patterns/") ? "registry:block" : "registry:ui",
    registryDependencies: [...registryDependencies].sort(),
    ...(dependencies.size ? { dependencies: [...dependencies].sort().map(declaredPackage) } : {}),
    files: [file, ...[...extras].sort()]
  });
});

if (failures.length) throw new Error(failures.join("\n"));

const json = (value: unknown) => JSON.stringify(value, null, 2) + "\n";
const entries = items.map((item) => ({ ...item, files: item.files.map(fileEntry) }));
const outputs = new Map<string, string>();
outputs.set(
  "registry.json",
  json({
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: registryName,
    homepage: "https://github.com/Infisical/cipher",
    items: entries
  })
);
entries.forEach((item, index) =>
  outputs.set(
    item.name + ".json",
    json({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      ...item,
      files: item.files.map((entry, fileIndex) => ({ ...entry, content: portable(items[index].files[fileIndex]) }))
    })
  )
);

const existing = existsSync(out) ? readdirSync(out).filter((file) => file.endsWith(".json")) : [];
if (check) {
  const stale = [
    ...[...outputs].filter(([file, text]) => !existing.includes(file) || readFileSync(path.join(out, file), "utf8") !== text).map(([file]) => file),
    ...existing.filter((file) => !outputs.has(file))
  ];
  if (stale.length) {
    process.stderr.write("Stale registry payloads in r/: " + stale.join(", ") + ". Run npm run registry.\n");
    process.exit(1);
  }
  process.stdout.write("Checked " + outputs.size + " registry files in r/.\n");
} else {
  existing.filter((file) => !outputs.has(file)).forEach((file) => rmSync(path.join(out, file)));
  mkdirSync(out, { recursive: true });
  outputs.forEach((text, file) => writeFileSync(path.join(out, file), text));
  process.stdout.write("Generated " + items.length + " registry items in r/.\n");
}
