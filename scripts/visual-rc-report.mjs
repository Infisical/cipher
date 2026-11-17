// Writes report.md and report.json for scripts/visual-rc.sh and exits 1 on any unexplained change.
// Usage: node scripts/visual-rc-report.mjs <out> <base-tag> <explain-file|""> <compare-tag|""> <step>...
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [out, base, explainFile, compare, ...steps] = process.argv.slice(2);
const explanations = explainFile ? JSON.parse(readFileSync(explainFile, "utf8")) : {};
const snapshots = (step) => path.join(out, "snapshots", step);
const diff = (from, to, label) =>
  JSON.parse(
    execFileSync(
      "node",
      [
        "scripts/visual-compare.mjs",
        snapshots(from),
        snapshots(to),
        path.join(out, "images", label)
      ],
      {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024
      }
    )
  );
const glob = (pattern) =>
  new RegExp(
    `^${pattern
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replaceAll("*", ".*")
      .replaceAll("?", ".")}$`
  );
const stepLabel = (step) => (step === "1-main" ? "main" : step.replace(/^\d+-pr-/, ""));
const baselineUpdates = (pr) => {
  try {
    return new Set(
      execFileSync(
        "git",
        ["diff", "--name-only", `origin/main...refs/visual-rc/pr-${pr}`, "--", "visual/baselines"],
        {
          encoding: "utf8"
        }
      )
        .split("\n")
        .filter(Boolean)
        .map((file) => file.replace(/^visual\/baselines\//, ""))
    );
  } catch {
    return new Set();
  }
};
const explain = (label, key) => {
  if (label !== "main" && baselineUpdates(label).has(key)) return "Baseline updated in the PR";
  const name = key.split("/").pop();
  for (const [pattern, reason] of Object.entries(explanations[label] ?? {}))
    if (glob(pattern).test(name) || glob(pattern).test(key)) return reason;
  return null;
};

const report = { base, compare: compare || null, steps: [], unexplained: [] };
for (let i = 1; i < steps.length; i += 1) {
  const label = stepLabel(steps[i]);
  const result = diff(steps[i - 1], steps[i], steps[i]);
  const changes = [
    ...result.changed.map((key) => ({ key, kind: "changed" })),
    ...result.added.map((key) => ({ key, kind: "added" })),
    ...result.removed.map((key) => ({ key, kind: "removed" }))
  ].map((change) => ({
    ...change,
    reason: explain(label, change.key)
  }));
  for (const change of changes)
    if (!change.reason) report.unexplained.push({ step: label, ...change });
  report.steps.push({ step: steps[i], label, changes });
}
const last = steps[steps.length - 1];
report.net = diff("0-base", last, "net");
if (compare) report.against = diff(`compare-${compare}`, last, `against-${compare}`);
writeFileSync(path.join(out, "report.json"), JSON.stringify(report, null, 2));

const img = (step, key, kind) => {
  const file = path.join("images", step, key.replace(".png", `.${kind}.png`));
  return existsSync(path.join(out, file)) ? `![${kind}](${file})` : "";
};
const lines = [
  `# Release candidate visual check`,
  "",
  `Previous tag: \`${base}\`. Steps: main, then ${
    steps
      .slice(2)
      .map((step) => `#${stepLabel(step)}`)
      .join(", ") || "no PRs"
  }.`,
  "",
  report.unexplained.length
    ? `**Blocked: ${report.unexplained.length} unexplained change(s).**`
    : "**Every visual change is explained.**",
  "",
  `Net change from \`${base}\` to the candidate: ${report.net.changed.length} changed, ${report.net.added.length} added, ${report.net.removed.length} removed.`
];
if (report.against)
  lines.push(
    "",
    `Against \`${compare}\`: ${report.against.changed.length} changed, ${report.against.added.length} added, ${report.against.removed.length} removed.`
  );
for (const step of report.steps) {
  lines.push("", `## ${step.label === "main" ? `main since ${base}` : `#${step.label}`}`, "");
  if (!step.changes.length) {
    lines.push("No visual change.");
    continue;
  }
  lines.push(
    "| Snapshot | Change | Explanation | Before | After | Diff |",
    "|---|---|---|---|---|---|"
  );
  for (const change of step.changes)
    lines.push(
      `| \`${change.key}\` | ${change.kind} | ${change.reason ?? "**Unexplained**"} | ${img(step.step, change.key, "before")} | ${img(step.step, change.key, "after")} | ${img(step.step, change.key, "diff")} |`
    );
}
writeFileSync(path.join(out, "report.md"), lines.join("\n") + "\n");
console.log(`report: ${path.join(out, "report.md")}`);
console.log(
  report.unexplained.length
    ? `${report.unexplained.length} unexplained change(s)`
    : "every change explained"
);
process.exit(report.unexplained.length ? 1 : 0);
