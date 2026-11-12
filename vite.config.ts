import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const root = import.meta.dirname;
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const packages = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies });
const modules = ["ui", "patterns", "lib", "hooks"].flatMap((folder) =>
  readdirSync(path.join(root, "src", folder))
    .filter((file) => /\.tsx?$/.test(file) && !/\.(test|spec)\.tsx?$/.test(file) && !file.endsWith(".d.ts"))
    .map((file) => `${folder}/${file.replace(/\.tsx?$/, "")}`)
);

const tailwindTheme = new Map(
  [...readFileSync(path.join(root, "node_modules/tailwindcss/theme.css"), "utf8").matchAll(/^\s*(--[\w.-]+):\s*([^;]+);/gm)].map(
    (match) => [match[1], match[2].replace(/\s+/g, " ").trim()]
  )
);
const withThemeDefaults = (css: string) => {
  const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((match) => match[1]));
  const needed = new Set<string>();
  const collect = (text: string) =>
    [...text.matchAll(/var\((--[\w-]+)/g)].forEach(([, name]) => {
      if (defined.has(name) || needed.has(name) || !tailwindTheme.has(name)) return;
      needed.add(name);
      collect(tailwindTheme.get(name)!);
    });
  collect(css);
  if (!needed.size) return css;
  return `.v4 {\n${[...needed].sort().map((name) => `  ${name}: ${tailwindTheme.get(name)};`).join("\n")}\n}\n${css}`;
};

const stylesheets = (): Plugin => ({
  name: "cipher-single-stylesheet",
  apply: "build",
  enforce: "post",
  generateBundle(_options, bundle) {
    const chunks = Object.values(bundle).filter((output) => output.type === "chunk");
    const byName = new Map(chunks.map((chunk) => [chunk.fileName, chunk]));
    const order: string[] = [];
    const visited = new Set<string>();
    const visit = (fileName: string) => {
      const chunk = byName.get(fileName);
      if (!chunk || visited.has(fileName)) return;
      visited.add(fileName);
      chunk.imports.forEach(visit);
      chunk.viteMetadata?.importedCss.forEach((css) => {
        if (!order.includes(css)) order.push(css);
      });
    };
    const entries = chunks.filter((chunk) => chunk.isEntry).map((chunk) => chunk.fileName);
    ["styles.js", ...entries.sort()].forEach(visit);
    const stray = Object.keys(bundle).filter((name) => name.endsWith(".css") && !order.includes(name));
    if (stray.length) this.error(`Stylesheets outside the import graph: ${stray.join(", ")}`);
    const text = (name: string) => {
      const asset = bundle[name];
      return asset.type === "asset" ? String(asset.source) : "";
    };
    const modules = order.filter((name) => name !== "v4.css");
    this.emitFile({ type: "asset", fileName: "cipher.css", source: withThemeDefaults(order.map(text).join("\n")) });
    this.emitFile({ type: "asset", fileName: "modules.css", source: modules.map(text).join("\n") });
    order.forEach((name) => delete bundle[name]);
    delete bundle["styles.js"];
    delete bundle["styles.js.map"];
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), stylesheets()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: Object.fromEntries([
        ["styles", path.join(root, "src/styles.ts")],
        ["scope", path.join(root, "src/scope.tsx")],
        ...modules.map((name) => [name, path.join(root, "src", name)])
      ]),
      formats: ["es"]
    },
    rollupOptions: {
      external: (id) =>
        /^node:/.test(id) || packages.some((name) => id === name || id.startsWith(`${name}/`)),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js"
      }
    }
  }
});
