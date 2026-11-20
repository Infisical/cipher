# Releasing Cipher

Releases are cut by maintainers. Each release is a `vX.Y.Z` tag on a commit that adds the built `dist/` to its source commit, so one tag pins both the package install and the registry URL.

## Check what changed

The Cipher visual check workflow (`.github/workflows/cipher-visual.yml`) renders every showcase example at a baseline ref and a candidate ref, both in the pinned Playwright image, and pixel-diffs them. Run it with the previous tag as the baseline and the release commit as the candidate, and read the changed list against the release's pull requests:

```bash
$ gh workflow run cipher-visual.yml -f base=v0.1.18 -f candidate=<sha>
$ gh workflow run cipher-visual.yml -f base=v0.1.18 -f candidate=<sha> -f scope=scoped
```

A release tag renders the source commit under it. With `scope=scoped` it renders only the pages whose examples reach a changed file, following imports, plus pages whose own example or catalog entry changed. An icon change reaches the pages that name a changed or added icon and the icon gallery. Changes to tokens, global CSS, fonts, theme code, installed dependencies (the lockfile, or `package.json` beyond its version), shared showcase files, or the frame and overlay primitives (Card, Dialog, Sheet, Popover, menus, tooltips and their shared stylesheets) render every page. The `prepare` job prints the scope and why.

The run summary lists every changed snapshot with its pixel count. The `cipher-visual-report` artifact holds `summary.md`, `summary.json`, `scope.json` and `changed/`, with a before, after and diff image for each change.

### Release candidate check

The release candidate check renders the previous tag, then applies each pull request in order, and reports every example that changed at each step. A change is explained when that step's pull request updated the example's baseline, or when the explanations file names it. Any other change fails the check.

It also reads source, because some changes no example shows. A merge commit that edits lines in neither parent, or a pull request that edits an existing stylesheet line while no existing example changes, fails the check until the explanations file names it as `merge:<sha>` or `css:<path>`.

```bash
$ scripts/visual-rc.sh --base v0.1.12 --version 0.1.13 --explain explanations.json 95 99 103
$ scripts/visual-rc.sh --merged --base v0.1.13 --version 0.1.14 --explain explanations.json 118=f4de878 119=491308f
```

With `--merged`, name each pull request's commit on main, in merge order. The report is `visual/rc/<version>/report.md`.

## Cut the release

1. Bump `version` in `package.json` in a pull request and merge it.
2. Run the Release workflow with `commit` set to that merge's full sha. It builds exactly that commit, even if main has moved since, and refuses a commit that isn't on main.

   ```bash
   $ gh workflow run release.yml -f commit=<merge sha>
   ```

3. The Showcase workflow runs when the release succeeds and publishes the source of the newest tag to GitHub Pages, so the showcase matches the package. To publish it without a release, run the Showcase workflow by hand.

## Publishing to npm

The Release workflow publishes to npm with provenance after it pushes the tag, but only when the `NPM_PUBLISH` repository variable is `true`. Otherwise it skips the publish and the git tag is the release. To turn it on, create `@infisical/cipher` on npm, add a trusted publisher for GitHub Actions (`Infisical/cipher`, `release.yml`), and set `NPM_PUBLISH=true`.

With publishing on, npm provenance records the commit the run was dispatched from, so dispatch from a ref that points at the release commit:

```bash
$ git push origin <merge sha>:refs/heads/release-<merge sha>
$ gh workflow run release.yml --ref release-<merge sha> -f commit=<merge sha>
```
