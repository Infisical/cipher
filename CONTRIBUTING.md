# Contributing to Cipher

Thanks for helping improve Cipher. Bug reports, fixes and new examples are all welcome.

For anything bigger than a small fix, such as a new component, a new prop or a change to how something looks, open an issue first so we can agree on the approach before you write the code.

## Set up

You need Node.js 24 and npm.

```bash
$ git clone https://github.com/<your-username>/cipher
$ cd cipher
$ npm ci
$ npm run site
```

`npm run site` starts the showcase: every component and its examples, in Light and Dark. It imports Cipher from `src/`, so your edits show up as you save.

## Where things live

| Path | What it holds |
|---|---|
| `src/ui/` | Components |
| `src/patterns/` | Larger compositions built from components |
| `src/lib/`, `src/hooks/` | Shared helpers and hooks |
| `src/tokens.json` | Design tokens. `src/tokens.generated.css` is generated from it. |
| `r/` | The shadcn registry, generated from `src/` by `npm run registry`. Not committed: the Release workflow adds it to each release tag. |
| `site/` | The showcase. Examples live in `site/src/examples/<page>/` and pages are listed in `site/src/catalog.json`. |
| `visual/baselines/` | Screenshot baselines for the visual tests |

## Make a change

1. Edit the source in `src/`.
2. Add or update an example in `site/src/examples/` that shows the change.
3. If you changed `src/tokens.json`, run `npm run tokens`.
4. Check your work:

   ```bash
   $ npm run typecheck
   $ npm run check   # tokens.generated.css matches the source, the registry resolves, and the CSS lint passes
   $ npm run build
   ```

CI runs the same checks and fails if the generated tokens are stale or a registry item imports something it can't ship.

### Code style

Match the code around you. Keep comments for the reason behind something that isn't obvious from the code; don't narrate what a line does or record what changed.

## Visual tests

CI screenshots every example on every showcase page in Light and Dark, at 1706px and 390px wide, and fails when a screenshot differs from its baseline in `visual/baselines/`. The tests run in the pinned Playwright image through Docker, so you need Docker running locally.

```bash
$ npm run visual                              # compare against the baselines
$ npm run visual:update                       # rewrite the baselines that changed
$ VISUAL_PAGES=card,button npm run visual     # only these showcase pages
```

If your change is meant to change how something looks, run `npm run visual:update` and commit the new baselines. A maintainer reviews them as image diffs and adds the `visual-change` label, which CI requires on any pull request that touches `visual/baselines/`.

## Open a pull request

- Keep each pull request to one change.
- Describe what changed and why, and add before and after screenshots for anything visual.
- Link the issue it resolves.

## Reporting security issues

Don't open a public issue for a security problem. See [SECURITY.md](SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
