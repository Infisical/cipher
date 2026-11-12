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

const singleStylesheet = (fileName: string): Plugin => ({
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
    const source = order
      .map((name) => {
        const asset = bundle[name];
        return asset.type === "asset" ? String(asset.source) : "";
      })
      .join("\n");
    order.forEach((name) => delete bundle[name]);
    delete bundle["styles.js"];
    delete bundle["styles.js.map"];
    this.emitFile({ type: "asset", fileName, source });
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss(), singleStylesheet("cipher.css")],
  define: {
    "import.meta.env.DEV": 'process.env.NODE_ENV !== "production"'
  },
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
