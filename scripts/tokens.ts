import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { type ThemeDefinition, themeChain, themedValue } from "../src/lib/themes";

type TokenValue = string | number | Record<string, string>;
type Tokens = {
  type: {
    families: Record<string, string>;
    groups: { styles: ({ name: string } & Record<string, string | number>)[] }[];
  };
  themes: { list: ThemeDefinition[] };
} & Record<string, unknown>;

const root = path.resolve(import.meta.dirname, "..");
const check = process.argv.includes("--check");
const output = path.join(root, "src/tokens.generated.css");
const tokens: Tokens = JSON.parse(readFileSync(path.join(root, "src/tokens.json"), "utf8"));
const themed: { name: string; value: Record<string, string> }[] = [];
const constant: { name: string; value: string | number }[] = [];
Object.values(tokens).forEach((family) => {
  if (!family || typeof family !== "object" || !("tokens" in family)) return;
  (family as { tokens: { name: string; value: TokenValue }[] }).tokens.forEach((token) => {
    if (typeof token.value === "object") themed.push({ name: token.name, value: token.value });
    else constant.push({ name: token.name, value: token.value });
  });
});
const cssValue = (value: string | number) => String(value).replace(/\{([^}]+)\}/g, "var(--cipher-$1)");
const rule = (selector: string, values: string[]) =>
  `${selector} {\n${values.map((value) => `  ${value}`).join("\n")}\n}\n`;
const cssProperties: Record<string, string> = {
  fontFamily: "font-family",
  fontSize: "font-size",
  lineHeight: "line-height",
  fontWeight: "font-weight",
  letterSpacing: "letter-spacing",
  fontStyle: "font-style",
  textTransform: "text-transform",
  fontStretch: "font-stretch"
};
const typeValues = [
  ...Object.entries(tokens.type.families).map(([name, value]) => `--cipher-font-${name}: ${value};`),
  ...tokens.type.groups.flatMap((group) =>
    group.styles.flatMap((style) =>
      Object.entries(cssProperties)
        .filter(([key]) => style[key] !== undefined)
        .map(([key, css]) => `--cipher-type-${style.name}-${css}: ${style[key]};`)
    )
  )
];
const themes = tokens.themes.list;
const failures: string[] = [];
let css = "/* Generated from tokens.json by npm run tokens. */\n";
css += rule(".cipher", [
  ...constant.map((token) => `--cipher-${token.name}: ${cssValue(token.value)};`),
  ...themed.map((token) => `--cipher-${token.name}: ${cssValue(token.value.light)};`),
  ...typeValues
]);
css += rule(
  '.cipher[data-scheme="dark"]',
  themed.map((token) => `--cipher-${token.name}: ${cssValue(token.value.dark ?? token.value.light)};`)
);
const themedNames = new Set(themed.map((token) => token.name));
themes.forEach((theme) => {
  if (Boolean(theme.base) === Boolean(theme.extends))
    failures.push(`Theme ${theme.id} needs exactly one of base and extends`);
  const { base } = themeChain(themes, theme.id);
  if (base !== theme.scheme)
    failures.push(`Theme ${theme.id} declares scheme ${theme.scheme} but resolves to the ${base} base`);
  Object.keys(theme.overrides).forEach((name) => {
    if (!themedNames.has(name)) failures.push(`Theme ${theme.id} overrides unknown token ${name}`);
  });
  const changed = themed.filter(
    (token) =>
      themedValue(themes, theme.id, token.name, token.value) !==
      (token.value[base] ?? token.value.light)
  );
  if (changed.length)
    css += rule(
      `.cipher[data-theme="${theme.id}"]`,
      changed.map(
        (token) =>
          `--cipher-${token.name}: ${cssValue(themedValue(themes, theme.id, token.name, token.value))};`
      )
    );
});
if (failures.length) throw new Error(failures.join("\n"));
if (check) {
  let current = "";
  try {
    current = readFileSync(output, "utf8");
  } catch {}
  if (current !== css) {
    process.stderr.write("src/tokens.generated.css is stale. Run npm run tokens.\n");
    process.exit(1);
  }
  process.stdout.write("src/tokens.generated.css is current.\n");
} else {
  writeFileSync(output, css);
  process.stdout.write(`Generated src/tokens.generated.css from ${themes.length} themes.\n`);
}
