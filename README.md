# Cipher

Cipher is Infisical's design system: React components, design tokens and two themes, Light and Dark. Browse every component and its examples in the [showcase](https://infisical.com/cipher).

Use it two ways:

- **Package** (`@infisical/cipher`): import compiled components and one prebuilt stylesheet. Your app doesn't need Tailwind.
- **shadcn registry**: copy the component source into your project with the shadcn CLI and own the code.

Both come from the same source in [src/](src/).

## Install the package

Cipher requires React 19.2 or later. Until it's published to npm, install a release tag from GitHub. Use the latest tag from the [releases page](https://github.com/Infisical/cipher/releases):

```bash
$ npm install github:Infisical/cipher#v0.1.30 motion sonner
```

`motion` and `sonner` are peer dependencies. Install `recharts` if you use the chart, `@xterm/xterm` and `@xterm/addon-fit` if you use the terminal, and the `@codemirror/*` and `@lezer/highlight` packages listed in [package.json](package.json) if you use the code editor.

## Usage

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

The stylesheet holds the tokens, both themes, the fonts and every utility the components use, scoped under `.cipher`, so Cipher's styles don't leak into the rest of your app.

Every module has its own entry point, named like its registry item:

```tsx
import { Dialog } from "@infisical/cipher/ui/dialog";
import { FilterBar } from "@infisical/cipher/patterns/filter-bar";
import { cn } from "@infisical/cipher/lib/utils";
import { useIsMobile } from "@infisical/cipher/hooks/use-mobile";
```

The raw tokens are at `@infisical/cipher/tokens.json` and `@infisical/cipher/tokens.css`.

### With Tailwind CSS v4

To use Cipher's theme utilities (`bg-background`, `text-muted-foreground` and the rest) in your own markup inside `CipherScope`, import the Tailwind entry instead of `styles.css`, so your Tailwind build compiles Cipher's stylesheet with your sources:

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

## Install from the registry

The registry needs TypeScript, Tailwind CSS v4 and a project set up with `npx shadcn@latest init`. Register the `@cipher` namespace once, then add items by name:

```bash
$ npx shadcn@latest registry add "@cipher=https://raw.githubusercontent.com/Infisical/cipher/v0.1.18/r/{name}.json"
$ npx shadcn@latest add @cipher/cipher-base @cipher/button @cipher/dialog
```

The URL pins a release. Swap in a newer tag to upgrade. Only release tags carry `r/`, so a branch or a source commit doesn't serve the registry. Every item depends on `@cipher/cipher-base`, which the CLI installs for you. Run `npx shadcn@latest search @cipher` to see what's available.

Files land under `src/components/cipher/` and import each other by relative path, so they don't depend on your import aliases. Import the stylesheet once, after your Tailwind entry, and wrap Cipher UI in `CipherScope`:

```tsx
import "./index.css";
import "./components/cipher/base.css";

import { CipherScope } from "./components/cipher/scope";
```

To update, point the `@cipher` URL in `components.json` at the new ref, review the changes, then apply them. `--overwrite` replaces your local copies, so commit or stash local edits first.

```bash
$ npx shadcn@latest add @cipher/button --diff
$ npx shadcn@latest add @cipher/cipher-base @cipher/button --overwrite
```

## Guides

**Themes.** `CipherScope` takes `theme="light"` or `theme="dark"`. Overlays and toasts portal into the scope, so they follow its theme.

**Nesting surfaces.** A frame never holds another frame. A block inside a card, a sheet section or a frame is an `Inset`: tinted fill, inset padding and no border. In development, a `Card variant="framed"` inside a frame logs a warning that points to `Inset`.

**Links and routing.** Link components (`RowLink`, `CardLink`, `Breadcrumb`, `Sidebar` and others) take a `link` prop. By default it's `{ href: string }` and renders a plain anchor, so Cipher needs no router. To route through yours, wrap the app in `CipherRouterProvider` from `lib/link` with your router's `Link` and a match hook, and augment `CipherRegister` to type `link` as your router's link options.

**Cursors.** A pointer cursor means navigation. Anything that renders as a link (`a[href]`) shows one, whichever component styles it. Controls that act in place, such as buttons, menu commands, toggles, selects and in-page tabs, keep the default cursor.

## Contributing

```bash
$ npm ci
$ npm run site    # the showcase, with Cipher loaded from src/
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow, the generated files and the visual tests, and [RELEASING.md](RELEASING.md) for how releases are cut.

## License

Cipher is MIT licensed. See [LICENSE](LICENSE).

The Archivo and Geist Mono fonts are licensed under the SIL Open Font License 1.1. Their license texts ship in `src/fonts/`, in the package under `dist/fonts/`, and with `@cipher/cipher-base`. The Infisical name and logo are trademarks of Infisical Inc. and are not part of the license.

Some icons are adapted from Lucide (ISC) and Hugeicons (MIT). [src/THIRD_PARTY_NOTICES.md](src/THIRD_PARTY_NOTICES.md) lists them with their license texts. It ships in the package as `dist/THIRD_PARTY_NOTICES.md` and with `@cipher/cipher-base`.
