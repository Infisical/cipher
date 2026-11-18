#!/usr/bin/env bash
# Release candidate check: renders the previous tag, main, and main plus each PR in order, then reports
# every example that changed at each step. A change is explained when that step's PR updated the
# example's baseline under visual/baselines, or when the explanations file names it. Any other change
# fails the check.
#
# Usage: scripts/visual-rc.sh --base v0.1.12 --version 0.1.13 [--explain file.json] [--compare v0.1.10] PR...
# A PR given as N=<ref> merges that ref instead of the PR's head, for a conflict resolved by hand.
# With --merged, every PR is already on main: give each as N=<sha of its commit on main>, in merge
# order. The candidate starts at the base tag instead of main, each step applies that commit, and a
# PR's baseline updates are read from the commit itself, so squash merges work.
# The explanations file maps a step ("main" or a PR number) to globs over snapshot names:
#   { "113": { "card-band-actions--*": "Framed card actions keep their own display" } }
# Two source checks block too, explained by key: "merge:<sha7>" for a merge commit on the PR that
# edits lines in neither parent, and "css:<path>" for a stylesheet the PR changes when none of its
# existing examples change.
# Output goes to visual/rc/<version>/: report.md, report.json and the images it links.
set -euo pipefail
cd "$(dirname "$0")/.."
root=$PWD
base="" version="" explain="" compare="" merged="" prs=()
while [ $# -gt 0 ]; do
  case "$1" in
    --base) base=$2; shift 2 ;;
    --version) version=$2; shift 2 ;;
    --explain) explain=$(realpath "$2"); shift 2 ;;
    --compare) compare=$2; shift 2 ;;
    --merged) merged=1; shift ;;
    *) prs+=("$1"); shift ;;
  esac
done
[ -n "$base" ] && [ -n "$version" ] || { echo "Usage: $0 --base <tag> --version <x.y.z> [--explain file] [--compare <tag>] PR..." >&2; exit 2; }

out="visual/rc/$version"
rm -rf "$out"
git worktree prune
mkdir -p "$out/snapshots" "$out/work"
git fetch -q origin main --tags
for spec in "${prs[@]}"; do
  pr=${spec%%=*}
  if [ "$spec" != "$pr" ]; then
    git update-ref "refs/visual-rc/pr-$pr" "$(git rev-parse "${spec#*=}")"
  else
    git fetch -q -f origin "pull/$pr/head:refs/visual-rc/pr-$pr"
  fi
done

overlay=(site/visual.html site/src/visual.tsx site/vite.visual.config.ts)
port=4180
render() {
  local dir=$1 name=$2
  for file in "${overlay[@]}"; do cp "$root/$file" "$dir/$file"; done
  local lock
  lock=$(sha1sum "$dir/package-lock.json" | cut -c1-12)
  if [ ! -f "$dir/node_modules/.visual-lock-$lock" ]; then
    (cd "$dir" && npm ci --no-audit --no-fund --loglevel=error >/dev/null && touch "node_modules/.visual-lock-$lock")
  fi
  (cd "$dir" && npx vite build --config site/vite.visual.config.ts --logLevel error)
  port=$((port + 1))
  while curl -s -o /dev/null "http://127.0.0.1:$port/"; do port=$((port + 1)); done
  setsid bash -c "cd '$dir' && exec npx vite preview --config site/vite.visual.config.ts --host 127.0.0.1 --port $port --strictPort" >/dev/null 2>&1 &
  local server=$!
  for _ in $(seq 60); do curl -sf "http://127.0.0.1:$port/visual.html" >/dev/null && break; sleep 1; done
  VISUAL_WORKERS=${VISUAL_WORKERS:-4} VISUAL_URL="http://127.0.0.1:$port/" VISUAL_CATALOG="$dir/site/src/catalog.json" \
    VISUAL_SNAPSHOTS="$out/snapshots/$name" bash scripts/visual.sh --update-snapshots=all --reporter=dot >"$out/work/$name.log" 2>&1 || true
  kill -- -$server 2>/dev/null || true
  wait $server 2>/dev/null || true
  (cd "$dir" && for file in "${overlay[@]}"; do
    if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then git checkout -q -- "$file"; else rm -f "$file"; fi
  done)
  local count
  count=$(find "$out/snapshots/$name" -name '*.png' 2>/dev/null | wc -l)
  [ "$count" -gt 0 ] || { echo "rendered no snapshots for $name, see $out/work/$name.log" >&2; exit 1; }
  echo "rendered $name: $count snapshots"
}

steps=()
# A release tag points at a commit that only adds dist/ and strips package.json for the package, so
# render the source commit under it.
source_of() {
  local ref=$1
  if git rev-parse -q --verify "$ref^" >/dev/null &&
    [ -z "$(git diff --name-only "$ref^" "$ref" -- . ':!dist' ':!package.json')" ]; then
    git rev-parse "$ref^"
  else
    git rev-parse "$ref^{commit}"
  fi
}
add_worktree() { git worktree add -q --detach "$1" "$(source_of "$2")"; }
cleanup() { for dir in "$out"/work/*/; do git worktree remove --force "$dir" 2>/dev/null || true; done; }
trap cleanup EXIT

if [ -n "$compare" ]; then
  add_worktree "$out/work/compare" "$compare"
  render "$out/work/compare" "compare-$compare"
fi
add_worktree "$out/work/base" "$base"
render "$out/work/base" "0-base"
steps+=("0-base")

cand="$out/work/candidate"
if [ -n "$merged" ]; then
  add_worktree "$cand" "$base"
else
  add_worktree "$cand" origin/main
  render "$cand" "1-main"
  steps+=("1-main")
fi

i=1
for spec in "${prs[@]}"; do
  pr=${spec%%=*}
  i=$((i + 1))
  if ! (cd "$cand" && git -c user.name=rc -c user.email=rc@localhost merge -q --no-edit "refs/visual-rc/pr-$pr" >/dev/null 2>&1); then
    conflicts=$(cd "$cand" && git diff --name-only --diff-filter=U)
    if echo "$conflicts" | grep -qv '^r/'; then
      echo "PR #$pr conflicts with the candidate outside r/: $conflicts" >&2
      exit 1
    fi
    (cd "$cand" && git checkout -q --theirs -- $conflicts && git add $conflicts && git -c user.name=rc -c user.email=rc@localhost commit -q --no-edit)
  fi
  render "$cand" "$i-pr-$pr"
  steps+=("$i-pr-$pr")
done

VISUAL_RC_MERGED=$merged node scripts/visual-rc-report.mjs "$out" "$base" "$explain" "$compare" "${steps[@]}"
