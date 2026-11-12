import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
cpSync(path.join(root, "src/tokens.json"), path.join(dist, "tokens.json"));
cpSync(path.join(root, "src/tokens.generated.css"), path.join(dist, "tokens.css"));
mkdirSync(path.join(dist, "fonts"), { recursive: true });
readdirSync(path.join(root, "src/fonts"))
  .filter((file) => file.endsWith(".txt"))
  .forEach((file) => cpSync(path.join(root, "src/fonts", file), path.join(dist, "fonts", file)));
