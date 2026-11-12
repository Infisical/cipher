import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

import { excludedModules } from "./cipher.config";

const from = process.argv[2];
if (!from) {
  process.stderr.write("Usage: npm run sync -- <path to an Infisical frontend checkout>\n");
  process.exit(1);
}
const source = path.resolve(from, "src/components/v4");
if (!existsSync(path.join(source, "tokens.json"))) {
  process.stderr.write(`No Cipher source at ${source}\n`);
  process.exit(1);
}
const root = path.resolve(import.meta.dirname, "..");
const target = path.join(root, "src");

const copied = ["ui", "patterns", "lib", "hooks", "fonts", "skills", "docs", "scope.tsx", "tokens.json", "v4.css", "AGENTS.md"];
const excludedFiles = new Set(
  Object.keys(excludedModules).flatMap((name) => [
    `ui/${name}.tsx`,
    `ui/${name}.module.css`,
    `patterns/${name}.tsx`,
    `patterns/${name}.module.css`,
    `docs/${name}.md`
  ])
);
const skipped = (relative: string) =>
  excludedFiles.has(relative) ||
  /\.(test|spec)\.tsx?$/.test(relative) ||
  (relative.startsWith("docs/") && !relative.endsWith(".md"));

const filesIn = (folder: string): string[] =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesIn(path.join(folder, entry.name))
      : [path.join(folder, entry.name)]
  );

const portable = (relative: string, text: string) => {
  let result = text.replace(/(["'])@app\/components\/v4\/([^"']+)\1/g, (_match, quote, suffix) => {
    let next = path.posix.relative(path.posix.dirname(relative), suffix);
    if (!next.startsWith(".")) next = `./${next}`;
    return `${quote}${next}${quote}`;
  });
  if (relative === "docs/README.md")
    result = result
      .split("\n")
      .filter((line) => !Object.keys(excludedModules).some((name) => line.includes(`(${name}.md)`)))
      .join("\n");
  if (relative === "v4.css")
    result = result
      .replace(/^@source "\.\.\/\.\.\/.+";\n/gm, "")
      .replace('@source "./ui";\n', '@source "./ui";\n@source "./patterns";\n');
  return result;
};

copied.forEach((entry) => rmSync(path.join(target, entry), { recursive: true, force: true }));
let count = 0;
copied.forEach((entry) => {
  const absolute = path.join(source, entry);
  if (!existsSync(absolute)) return;
  const files = statSync(absolute).isDirectory() ? filesIn(absolute) : [absolute];
  files.forEach((file) => {
    const relative = path.relative(source, file).split(path.sep).join("/");
    if (skipped(relative)) return;
    const destination = path.join(target, relative);
    mkdirSync(path.dirname(destination), { recursive: true });
    if (/\.(tsx?|css|md|json)$/.test(relative))
      writeFileSync(destination, portable(relative, readFileSync(file, "utf8")));
    else cpSync(file, destination);
    count += 1;
  });
});
process.stdout.write(`Synced ${count} files from ${path.relative(process.cwd(), source)} into src/.\n`);
