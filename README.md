# Cipher

Cipher is Infisical's design system: React components, design tokens and themes. Use it two ways:

- **npm package** (`@infisical/cipher`): import compiled components and one prebuilt stylesheet. Updates arrive through your package manager.
- **shadcn registry**: copy the component source into your project with the shadcn CLI and own the code.

Both come from the same source in [src/](src/).

## Requirements

- React 19
- For the registry: TypeScript, Tailwind CSS v4, and a project set up with `npx shadcn@latest init`

## Install the npm package

```bash
$ npm install @infisical/cipher motion sonner
```

`motion` and `sonner` are peer dependencies, so your app and Cipher share one copy. Install `recharts` too if you use the chart.

Import the stylesheet once and wrap Cipher UI in `V4Scope`:

```tsx
import "@infisical/cipher/styles.css";

import { V4Scope } from "@infisical/cipher/scope";
import { Button } from "@infisical/cipher/ui/button";
import { Toaster } from "@infisical/cipher/ui/sonner";

export function App() {
  return (
    <V4Scope theme="peach" className="min-h-screen bg-background text-foreground">
      <Button>Save changes</Button>
      <Toaster />
    </V4Scope>
  );
}
```

The stylesheet is compiled: it holds the tokens, the three themes, the fonts and every utility the components use, scoped under `.v4`. Your app doesn't need Tailwind, and if it has Tailwind, Cipher's styles don't leak into it.

If your app uses Tailwind CSS v4 and you want Cipher's theme utilities (`bg-background`, `text-muted-foreground` and the rest) in your own markup inside `V4Scope`, import the Tailwind entry instead of `styles.css`. Your Tailwind build then compiles Cipher's stylesheet with your sources:

```css
@import "tailwindcss";
@import "@infisical/cipher/tailwind.css";
@import "@infisical/cipher/modules.css";
@source "./pages";
```

Every module has its own entry point: `@infisical/cipher/ui/<name>`, `@infisical/cipher/patterns/<name>`, `@infisical/cipher/lib/<name>`, `@infisical/cipher/hooks/<name>` and `@infisical/cipher/scope`. The names match the registry items. The raw tokens are at `@infisical/cipher/tokens.json` and `@infisical/cipher/tokens.css`.

## Install from the registry

Register the `@cipher` namespace once, then add items by name:

```bash
$ npx shadcn@latest registry add "@cipher=https://raw.githubusercontent.com/Infisical/cipher/<ref>/r/{name}.json"
$ npx shadcn@latest add @cipher/cipher-base @cipher/button @cipher/dialog
```

Replace `<ref>` with a release tag or commit SHA to pin a version, or `main` to follow the latest. Every item depends on `@cipher/cipher-base`, which the CLI installs for you. To see what's available, run `npx shadcn@latest search @cipher`.

Files land under `src/components/v4/` and import each other by relative path, so they don't depend on your import aliases. Import the stylesheet once, after your Tailwind entry, and wrap Cipher UI in `V4Scope`:

```tsx
import "./index.css";
import "./components/v4/v4.css";

import { V4Scope } from "./components/v4/scope";
```

To update, point the `@cipher` URL in `components.json` at the new ref, then review and apply the changes:

```bash
$ npx shadcn@latest add @cipher/button --diff
$ npx shadcn@latest add @cipher/cipher-base @cipher/button --overwrite
```

`--overwrite` replaces your local copies, so commit or stash local edits first.

`@cipher/cipher-docs` installs the usage rules, a guide per component and the agent skill under `src/components/v4/`. Add it if you build with a coding agent.

## Themes

`V4Scope` takes a theme id: Lightly Peach (`peach`, the default light theme), Light (`pale`) or Dark (`dark`). Overlays and toasts portal into the scope, so they follow its theme.

## Links and routing

Link components (RowLink, CardLink, Breadcrumb, Sidebar and others) take a `link` prop. By default it's `{ href: string }` and renders a plain anchor, so Cipher needs no router. To route through your router, wrap the app in `CipherRouterProvider` from `lib/link` with your router's `Link` and a match hook, and augment `CipherRegister` to type `link` as your router's link options.

## Not included

These depend on the Infisical app and stay out of Cipher (`scripts/cipher.config.ts`):

- `app-connection-form`: builds Infisical App Connection forms from presets, schemas and a redirect flow that live in the app.
- `provider-icon`: loads integration logos from the Infisical app's static assets.

## Development

```bash
$ npm ci
$ npm run typecheck
$ npm run check   # tokens.generated.css and r/ match the source
$ npm run build   # dist/: ESM, types, cipher.css, tokens
$ npm pack        # a tarball to install in another project
```

After changing `src/tokens.json`, run `npm run tokens`. After changing anything in `src/`, run `npm run registry` and commit `r/` with it. CI fails if either is stale.

Until the Infisical app consumes this package, the source of truth is `frontend/src/components/v4` in [Infisical/infisical](https://github.com/Infisical/infisical). `npm run sync -- <path to infisical/frontend>` copies it into `src/`, drops the excluded modules and tests, and rewrites app imports to relative paths. Run `npm run tokens` and `npm run registry` after it.

## Release

1. Bump `version` in `package.json`.
2. Tag the commit on main (for example `v0.1.0`). The tag pins both the registry URL and the npm version.
3. Publish with `npm publish --access public`.

## License

Cipher is MIT licensed. See [LICENSE](LICENSE).

The Archivo and Geist Mono fonts are licensed under the SIL Open Font License 1.1. Their license texts ship in `src/fonts/`, in the npm package under `dist/fonts/`, and with `@cipher/cipher-base`. The Infisical name and logo are trademarks of Infisical Inc. and are not part of the license.
