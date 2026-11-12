import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

import { excludedModules } from "./cipher.config";

const from = process.argv[2];
if (!from) {
  process.stderr.write("Usage: npm run sync -- <path to an Infisical frontend checkout>\n");
  process.exit(1);
}
const source = path.resolve(from, "src/components/v4");
if (!existsSync(path.join(source, "tokens.json"))) {
  process.stderr.write("No Cipher source at " + source + "\n");
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const target = path.join(root, "src");
const excluded = Object.keys(excludedModules);

const filesIn = (folder: string): string[] =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(path.join(folder, entry.name)) : [path.join(folder, entry.name)]
  );

const copied = ["ui", "patterns", "lib", "hooks", "fonts", "scope.tsx", "tokens.json", "v4.css"];
const excludedFiles = new Set(
  excluded.flatMap((name) =>
    ["ui", "patterns"].flatMap((folder) => [folder + "/" + name + ".tsx", folder + "/" + name + ".module.css"])
  )
);
const lintDirective = String.raw`(?:v4-check-ignore|eslint-disable|oxlint-disable)`;
const withoutLintDirectives = (text: string) =>
  text
    .replace(new RegExp(String.raw`^[ \t]*(?:\{?/\*[ \t]*${lintDirective}[^*]*\*/\}?|//[ \t]*${lintDirective}.*)\n`, "gm"), "")
    .replace(new RegExp(String.raw`[ \t]*//[ \t]*${lintDirective}.*$`, "gm"), "")
    .replace(new RegExp(String.raw`/\*[ \t]*${lintDirective}[^*]*\*/[ \t]*`, "g"), "");

const portable = (relative: string, text: string) => {
  const result = withoutLintDirectives(text).replace(/(["'])@app\/components\/v4\/([^"']+)\1/g, (_match, quote, suffix) => {
    let next = path.posix.relative(path.posix.dirname(relative), suffix);
    if (!next.startsWith(".")) next = "./" + next;
    return quote + next + quote;
  });
  if (relative !== "v4.css") return result;
  return result
    .replace(/^@source "\.\.\/\.\.\/.+";\n/gm, "")
    .replace('@source "./ui";\n', '@source "./ui";\n@source "./patterns";\n');
};

copied.forEach((entry) => rmSync(path.join(target, entry), { recursive: true, force: true }));
let count = 0;
copied.forEach((entry) => {
  const absolute = path.join(source, entry);
  const files = statSync(absolute).isDirectory() ? filesIn(absolute) : [absolute];
  files.forEach((file) => {
    const relative = path.relative(source, file).split(path.sep).join("/");
    if (excludedFiles.has(relative) || /\.(test|spec)\.tsx?$/.test(relative)) return;
    const destination = path.join(target, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    if (/\.(tsx?|css|json)$/.test(relative))
      writeFileSync(destination, portable(relative, readFileSync(file, "utf8")));
    else cpSync(file, destination);
    count += 1;
  });
});

// The generated guides hold the portable copy of every workbench example (plain hrefs, no
// presentation wrappers), so the showcase takes its examples from them rather than from pages/.
const groups = new Map<string, string>();
filesIn(path.join(source, "contracts")).forEach((file) => {
  let id: string | undefined;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line) => {
      id = /^ {2}(?: {2})?id: "([^"]+)"/.exec(line)?.[1] ?? id;
      const group = /^ {2}(?: {2})?group: "([^"]+)"/.exec(line)?.[1];
      if (id && group) groups.set(id, group);
    });
});
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const packages = new Set(
  Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies, ...manifest.devDependencies })
);
const packageName = (specifier: string) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
const fence = "`".repeat(3);
const exampleBlock = new RegExp(
  "### ([^\n]+)\n\nSave this example at .src/pages/design-system/examples/([^.]+)\.tsx.[^\n]*\n\nRegistry items used: ([^\n]*?)\. Additional[^\n]*\n\n" +
    fence +
    "tsx\\n([\\s\\S]*?)\\n" +
    fence,
  "g"
);
const site = path.join(root, "site/src");
rmSync(path.join(site, "examples"), { recursive: true, force: true });
const components = readdirSync(path.join(source, "docs"))
  .filter((file) => file.endsWith(".md") && !["README.md", "themes.md"].includes(file))
  .map((file) => {
    const id = path.basename(file, ".md");
    const text = readFileSync(path.join(source, "docs", file), "utf8");
    const [, title, summary] = /^# (.+)\n\n(.+)$/m.exec(text) ?? [];
    const examples = [...text.matchAll(exampleBlock)].flatMap(([, exampleTitle, module, items, code]) => {
      const imports = [...code.matchAll(/from "([^"]+)"/g)].map((match) => match[1]);
      const portableExample =
        !excluded.some((name) => items.includes("@cipher/" + name)) &&
        imports.every(
          (specifier) =>
            specifier.startsWith(".") || ["react", "react-dom"].includes(packageName(specifier)) || packages.has(packageName(specifier))
        );
      if (!portableExample) return [];
      const destination = path.join(site, "examples", module + ".tsx");
      mkdirSync(path.dirname(destination), { recursive: true });
      writeFileSync(destination, withoutLintDirectives(code).replace(/(["'])(?:\.\.\/)+components\/v4\//g, "$1@infisical/cipher/") + "\n");
      return [{ title: exampleTitle, module }];
    });
    return { id, title, summary, group: groups.get(id) ?? "Utilities", examples };
  })
  .filter((component) => !excluded.includes(component.id) && component.examples.length);
mkdirSync(site, { recursive: true });
writeFileSync(path.join(site, "catalog.json"), JSON.stringify(components, null, 2) + "\n");
process.stdout.write(
  "Synced " + count + " source files and " + components.length + " showcase pages from " + source + ".\n"
);
