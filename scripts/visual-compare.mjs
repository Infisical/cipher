// Compares two snapshot trees from scripts/visual-rc.sh and writes before, after and diff images.
// Usage: node scripts/visual-compare.mjs <before-dir> <after-dir> <out-dir>
// Prints JSON: { changed: [key], added: [key], removed: [key] }, where key is <project>/<file>.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const [before, after, out] = process.argv.slice(2);
const require = createRequire(import.meta.url);
const comparator = require("playwright-core/lib/coreBundle").utils.getComparator("image/png");

const list = (root) =>
  existsSync(root)
    ? readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((project) =>
          readdirSync(path.join(root, project.name)).map((file) => `${project.name}/${file}`)
        )
    : [];

const a = new Set(list(before));
const b = new Set(list(after));
const result = { changed: [], added: [], removed: [] };
const save = (key, name, buffer) => {
  const file = path.join(out, key.replace(".png", `.${name}.png`));
  mkdirSync(path.dirname(file), { recursive: true });
  if (Buffer.isBuffer(buffer)) writeFileSync(file, buffer);
  else copyFileSync(buffer, file);
};
for (const key of b) {
  if (!a.has(key)) {
    result.added.push(key);
    save(key, "after", path.join(after, key));
    continue;
  }
  const x = readFileSync(path.join(before, key));
  const y = readFileSync(path.join(after, key));
  if (x.equals(y)) continue;
  const diff = comparator(y, x, { threshold: 0.1, maxDiffPixelRatio: 0.0005 });
  if (!diff) continue;
  result.changed.push(key);
  save(key, "before", path.join(before, key));
  save(key, "after", path.join(after, key));
  if (diff.diff) save(key, "diff", diff.diff);
}
for (const key of a) if (!b.has(key)) result.removed.push(key);
console.log(JSON.stringify(result));
