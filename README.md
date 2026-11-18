# Cipher

Cipher is Infisical's design system: React components, design tokens and themes. Use it two ways:

- **Package** (`@infisical/cipher`): import compiled components and one prebuilt stylesheet. Updates arrive through your package manager.
- **shadcn registry**: copy the component source into your project with the shadcn CLI and own the code.

Both come from the same source in [src/](src/).

## Requirements

- React 19.2 or later
- For the registry: TypeScript, Tailwind CSS v4, and a project set up with `npx shadcn@latest init`

## Install the package

Cipher isn't on npm yet. Install a release tag from GitHub:

```bash
$ npm install github:Infisical/cipher#v0.1.6 motion sonner
```

Use the latest tag from the [releases page](https://github.com/Infisical/cipher/releases). This README is updated with each release.

Each release tag points at a commit that holds the built package, so the install downloads it as is and runs no build.

`motion` and `sonner` are peer dependencies, so your app and Cipher share one copy. Install `recharts` too if you use the chart, and `@xterm/xterm` with `@xterm/addon-fit` if you use the terminal.

Import the stylesheet once and wrap Cipher UI in `CipherScope`:

```tsx
import "@infisical/cipher/styles.css";

import { CipherScope } from "@infisical/cipher/scope";
import { Button } from "@infisical/cipher/ui/button";
import { Toaster } from "@infisical/cipher/ui/sonner";

export function App() {
  return (
    <CipherScope theme="light" className="min-h-screen bg-background text-foreground">
      <Button>Save changes</Button>
      <Toaster />
    </CipherScope>
  );
}
```

The stylesheet is compiled: it holds the tokens, the two themes, the fonts and every utility the components use, scoped under `.cipher`. Your app doesn't need Tailwind, and if it has Tailwind, Cipher's styles don't leak into it.

If your app uses Tailwind CSS v4 and you want Cipher's theme utilities (`bg-background`, `text-muted-foreground` and the rest) in your own markup inside `CipherScope`, import the Tailwind entry instead of `styles.css`. Your Tailwind build then compiles Cipher's stylesheet with your sources:

```css
@import "tailwindcss";
@import "@infisical/cipher/tailwind.css";
@import "@infisical/cipher/modules.css";
@source "./pages";
```

Then import the fonts once from your JavaScript entry, so your bundler resolves the font files from the package:

```tsx
import "@infisical/cipher/fonts.css";
```

Every module has its own entry point: `@infisical/cipher/ui/<name>`, `@infisical/cipher/patterns/<name>`, `@infisical/cipher/lib/<name>`, `@infisical/cipher/hooks/<name>` and `@infisical/cipher/scope`. The names match the registry items. The raw tokens are at `@infisical/cipher/tokens.json` and `@infisical/cipher/tokens.css`.

## Install from the registry

Register the `@cipher` namespace once, then add items by name:

```bash
$ npx shadcn@latest registry add "@cipher=https://raw.githubusercontent.com/Infisical/cipher/v0.1.6/r/{name}.json"
$ npx shadcn@latest add @cipher/cipher-base @cipher/button @cipher/dialog
```

The URL pins the v0.1.6 release. Swap in the latest release tag, a commit SHA, or `main` to follow the latest. Every item depends on `@cipher/cipher-base`, which the CLI installs for you. To see what's available, run `npx shadcn@latest search @cipher`.

Files land under `src/components/cipher/` and import each other by relative path, so they don't depend on your import aliases. Import the stylesheet once, after your Tailwind entry, and wrap Cipher UI in `CipherScope`:

```tsx
import "./index.css";
import "./components/cipher/base.css";

import { CipherScope } from "./components/cipher/scope";
```

To update, point the `@cipher` URL in `components.json` at the new ref, then review and apply the changes:

```bash
$ npx shadcn@latest add @cipher/button --diff
$ npx shadcn@latest add @cipher/cipher-base @cipher/button --overwrite
```

`--overwrite` replaces your local copies, so commit or stash local edits first.

## Themes

`CipherScope` takes a theme id: Light (`light`) or Dark (`dark`). The retired ids `peach` and `pale` still resolve to Light. Overlays and toasts portal into the scope, so they follow its theme.

## Nesting surfaces

A frame never holds another frame. A block inside a framed container (a card, a sheet section or a frame) is an `Inset`: tinted fill, inset padding and no border. Use it for nested resources, templates, summary tiles and drop targets instead of a bordered `Card`. In development, a `Card variant="framed"` inside a frame logs a warning that points to `Inset`.

A `DocumentationLink` is icon only, so it always sits right after the title or label it documents: `PageHeader` and `Card` `badges`, or `Field` `help`.

## Links and routing

Link components (RowLink, CardLink, Breadcrumb, Sidebar and others) take a `link` prop. By default it's `{ href: string }` and renders a plain anchor, so Cipher needs no router. To route through your router, wrap the app in `CipherRouterProvider` from `lib/link` with your router's `Link` and a match hook, and augment `CipherRegister` to type `link` as your router's link options.

The pointer cursor means navigation. Anything that renders as a link (`a[href]`) shows a pointer, whichever component styles it: links, RowLink and CardLink rows, Sidebar and Breadcrumb items, linked tiles, a Button or menu item rendered as a link, and a TabsTrigger rendered as a link for route tabs. CommandMenu items with an `href` show one too. Controls that act in place, such as buttons, menu commands, toggles, selects and in-page tabs, keep the default cursor.

## Development

```bash
$ npm ci
$ npm run typecheck
$ npm run check   # tokens.generated.css and r/ match the source
$ npm run build   # dist/: ESM, types, cipher.css, tokens
$ npm pack        # a tarball to install in another project
$ npm run site    # the showcase: every component and its examples, in each theme
```

The showcase in `site/` imports Cipher from `src/` and ships in neither the package nor the registry. Each release publishes it to GitHub Pages, which infisical.com serves at [infisical.com/cipher](https://infisical.com/cipher). To publish it without a release, run the Showcase workflow by hand.

After changing `src/tokens.json`, run `npm run tokens`. After changing anything in `src/`, run `npm run registry` and commit `r/` with it. CI fails if either is stale.

To try local changes in an app, run `npm run build && npm pack` here and `npm install <path to the .tgz>` in the app. A tarball keeps one copy of React; a linked checkout resolves React from its own `node_modules` and renders a second copy.

## Visual tests

The Visual workflow screenshots every example block on every showcase page in Light and Dark, at 1706px and 390px wide, at device scale factor 2. It fails a pull request when any screenshot differs from its baseline in `visual/baselines/`, and uploads the expected, actual and diff images as an artifact.

```bash
$ npm run visual          # compare against the baselines
$ npm run visual:update   # rewrite the baselines that changed
$ VISUAL_PAGES=card,button npm run visual   # only these showcase pages
```

Both run in the pinned Playwright image through Docker, so local screenshots match CI pixel for pixel. A pull request that changes how something looks commits its updated baselines, and the workflow requires the `visual-change` label on any pull request that touches `visual/baselines/`, so every visual change is reviewed as an image diff.

## Release

Before a release, run the release candidate check. It renders the previous tag, main, and main plus each PR in order, and reports every example that changed at each step with before, after and diff images. A change is explained when that step's PR updated the example's baseline, or when the explanations file names it. Any other change fails the check and blocks the release.

The check also reads source, because some changes no example shows. A merge commit on a PR that edits lines in neither parent, or a PR that edits or removes an existing stylesheet line while no existing example changes, blocks the release until the explanations file names it as `merge:<sha>` or `css:<path>`.

```bash
$ scripts/visual-rc.sh --base v0.1.12 --version 0.1.13 --explain explanations.json 95 99 103
```

When the PRs have already merged, pass `--merged` and name each PR's commit on main, in merge order. The check starts from the previous tag and applies each commit in turn, so squash merges work too.

```bash
$ scripts/visual-rc.sh --merged --base v0.1.13 --version 0.1.14 --explain explanations.json 118=f4de878 119=491308f 120=5e843d9 121=ee1c1b8
```

The report is `visual/rc/<version>/report.md`.

1. Bump `version` in `package.json` in a pull request and merge it.
2. Run the Release workflow with `commit` set to that merge's full sha. It builds exactly that commit, even if main has moved since, and pushes a `vX.Y.Z` tag on a commit that adds `dist/` to it, so the tag pins both the registry URL and the package. The workflow refuses a commit that isn't on main. The Showcase then publishes the source of the newest release tag, so it matches the package.

   ```bash
   $ gh workflow run release.yml -f commit=<merge sha>
   ```
3. Bump the tag in the app's `package.json`.

## License

Cipher is MIT licensed. See [LICENSE](LICENSE).

The Archivo and Geist Mono fonts are licensed under the SIL Open Font License 1.1. Their license texts ship in `src/fonts/`, in the package under `dist/fonts/`, and with `@cipher/cipher-base`. The Infisical name and logo are trademarks of Infisical Inc. and are not part of the license.

Some icons are adapted from Lucide (ISC) and Hugeicons (MIT). [src/THIRD_PARTY_NOTICES.md](src/THIRD_PARTY_NOTICES.md) lists them with their license texts. Like the font licenses, it ships in the package as `dist/THIRD_PARTY_NOTICES.md` and with `@cipher/cipher-base`, which every registry component installs.
