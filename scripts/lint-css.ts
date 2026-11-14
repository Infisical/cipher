import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = join(import.meta.dirname, "..");
const rowClass = /\.([A-Za-z][\w-]*(?:Row|Pair|Item))\b/g;
const borderBottom = /(?:^|;)\s*border-(?:bottom|block-end)\s*:/;
const anyBorderBottom = /(?:^|;)\s*border-(?:bottom|block-end)(?:-[a-z]+)?\s*:/;
const allow = "lint-css-allow: single-row";
const reset = /:last-child|:last-of-type|\[data-last\b/;

const cssFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith(".css") && !entry.name.endsWith(".generated.css") ? [path] : [];
  });

const rules = (css: string) => {
  const found: { selector: string; body: string; raw: string; line: number }[] = [];
  const text = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      const selector = text.slice(start, i).trim();
      const close = text.indexOf("}", i);
      const next = text.indexOf("{", i + 1);
      if (selector.startsWith("@") || (next !== -1 && next < close)) {
        start = i + 1;
        continue;
      }
      found.push({
        selector,
        body: text.slice(i + 1, close),
        raw: css.slice(i + 1, close),
        line: text.slice(0, i).split("\n").length
      });
      i = close;
      start = close + 1;
    } else if (text[i] === "}") start = i + 1;
  }
  return found;
};

const lastCompound = (selector: string) => selector.split(/\s+|>|~/).filter(Boolean).at(-1) ?? "";

const problems: string[] = [];
for (const file of cssFiles(join(root, "src"))) {
  const parsed = rules(readFileSync(file, "utf8"));
  for (const rule of parsed) {
    if (!borderBottom.test(rule.body) || rule.raw.includes(allow)) continue;
    for (const selector of rule.selector.split(",").map((part) => part.trim())) {
      if (selector.includes("+") || reset.test(selector)) continue;
      for (const [, name] of lastCompound(selector).matchAll(rowClass)) {
        const resetInFile = parsed.some(
          (other) =>
            anyBorderBottom.test(other.body) &&
            other.selector
              .split(",")
              .some((part) => part.includes(`.${name}`) && (reset.test(part) || part.includes("+")))
        );
        if (!resetInFile)
          problems.push(
            `${relative(root, file)}:${rule.line} .${name} sets border-bottom on every row. Splice rows with .${name} + .${name} { border-top }, reset the last one with :last-child or [data-last], or mark a lone row with /* ${allow}: <reason> */.`
          );
      }
    }
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
