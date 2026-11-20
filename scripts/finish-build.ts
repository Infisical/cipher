import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const filesIn = (folder: string): string[] =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? filesIn(path.join(folder, entry.name)) : [path.join(folder, entry.name)]
  );

rmSync(path.join(dist, "styles.d.ts"), { force: true });
filesIn(dist)
  .filter((file) => file.endsWith(".d.ts"))
  .forEach((file) => {
    const text = readFileSync(file, "utf8");
    const next = text.replace(/^import ["'][^"']+\.css["'];\n/gm, "");
    if (next !== text) writeFileSync(file, next);
  });
const clientEntries = [path.join(dist, "scope.js")].concat(
  ...["ui", "patterns", "hooks"].map((folder) =>
    filesIn(path.join(dist, folder)).filter(
      (file) => file.endsWith(".js") && !file.endsWith(".module.js")
    )
  )
);
clientEntries.forEach((file) => {
  const text = readFileSync(file, "utf8");
  if (/^["']use client["']/.test(text) || !/from ["']react(-dom)?["'/]/.test(text)) return;
  writeFileSync(file, '"use client";\n' + text);
  const mapFile = file + ".map";
  if (!existsSync(mapFile)) return;
  const map = JSON.parse(readFileSync(mapFile, "utf8"));
  map.mappings = ";" + map.mappings;
  writeFileSync(mapFile, JSON.stringify(map));
});
cpSync(path.join(root, "src/tokens.json"), path.join(dist, "tokens.json"));
cpSync(path.join(root, "src/tokens.generated.css"), path.join(dist, "tokens.css"));
cpSync(path.join(root, "src/THIRD_PARTY_NOTICES.md"), path.join(dist, "THIRD_PARTY_NOTICES.md"));
mkdirSync(path.join(dist, "fonts"), { recursive: true });
readdirSync(path.join(root, "src/fonts")).forEach((file) =>
  cpSync(path.join(root, "src/fonts", file), path.join(dist, "fonts", file))
);
const source = readFileSync(path.join(root, "src/base.css"), "utf8");
const imported = '@import "./tokens.generated.css";\n';
if (!source.startsWith(imported)) throw new Error("src/base.css must open with " + imported.trim());
const fontFace = /@font-face\s*\{[^}]*\}\n*/g;
writeFileSync(path.join(dist, "fonts.css"), (source.match(fontFace) ?? []).join(""));
writeFileSync(
  path.join(dist, "tailwind.css"),
  '@import "./tokens.css";\n' + source.slice(imported.length).replace(fontFace, "")
);
