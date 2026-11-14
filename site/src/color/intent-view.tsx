import { useState } from "react";
import { Tabs } from "@infisical/cipher/ui/tabs";

import { colorGroups, type ColorGroup, sampleHues } from "./color-groups";
import { nearness, type Rgba } from "./color-values";
import { Swatch } from "./swatch";
import { hueRamp, referenceText, type TokenGraph } from "./token-graph";

import styles from "./color.module.css";

const NEAR = 1.5;

/** Splits tokens into runs that read as the same color on the surface: every member of a run is within NEAR of every other, and the group's order is kept. */
const clusterTokens = (names: readonly string[], colors: ReadonlyMap<string, Rgba>) => {
  const ground = colors.get("surface") ?? { r: 1, g: 1, b: 1, a: 1 };
  const distance = (left: string, right: string) => {
    const one = colors.get(left);
    const two = colors.get(right);
    return one && two ? nearness(one, two, ground) : Infinity;
  };
  const clusters: string[][] = [];
  names.forEach((name) => {
    const home = clusters.find((members) => members.every((member) => distance(member, name) < NEAR));
    if (home) home.push(name);
    else clusters.push([name]);
  });
  return clusters.map((members) => ({
    members,
    spread: Math.max(0, ...members.flatMap((left) => members.map((right) => (left === right ? 0 : distance(left, right)))))
  }));
};

function TokenLabels({ tokens }: { tokens: readonly string[] }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0">
      {tokens.map((token) => (
        <li key={token} className="inline-flex items-center gap-1.5 text-xs text-(--cipher-muted)">
          <span
            className="inline-block size-3 border border-(--cipher-line)"
            style={{ background: token.startsWith("hue-") ? "oklch(var(--cipher-" + token + ") " + sampleHues[0] + ")" : "var(--cipher-" + token + ")" }}
          />
          <code>{token}</code>
        </li>
      ))}
    </ul>
  );
}

function GroupSwatches({
  tokens,
  graph,
  colors
}: {
  tokens: readonly string[];
  graph: TokenGraph;
  colors: ReadonlyMap<string, Rgba>;
}) {
  return (
    <div className="flex flex-wrap items-start gap-x-6 gap-y-8">
      {clusterTokens(tokens, colors).map(({ members, spread }) => {
        const swatches = members.map((name) => (
          <Swatch
            key={name}
            name={name}
            paint={"var(--cipher-" + name + ")"}
            color={colors.get(name)}
            reference={referenceText(graph.nodes.get(name))}
          />
        ));
        if (members.length === 1) return swatches;
        return (
          <div key={members[0]} className={styles.cluster}>
            <span className="text-xs text-(--cipher-muted)">
              {spread < 0.05
                ? "Same color, " + members.length + " tokens"
                : "Near-identical, ΔE up to " + spread.toFixed(1)}
            </span>
            <div className="flex flex-wrap gap-x-6 gap-y-8">{swatches}</div>
          </div>
        );
      })}
    </div>
  );
}

function HueSwatches({ colors }: { colors: ReadonlyMap<string, Rgba> }) {
  const [hue, setHue] = useState(String(sampleHues[0]));
  return (
    <div className="flex flex-col gap-6">
      <Tabs
        label="Sample hue"
        variant="segmented"
        value={hue}
        onChange={setHue}
        tabs={sampleHues.map((value) => ({ value: String(value), label: String(value) }))}
      />
      <div className="flex flex-wrap items-start gap-x-6 gap-y-8">
        {hueRamp.names.map((name) => {
          const level = name.startsWith("hue-pop") ? "pop" : "subtle";
          return (
            <div key={name} data-hue={level} style={{ "--cipher-hue": hue } as React.CSSProperties}>
              <Swatch
                name={name}
                paint={"oklch(var(--cipher-" + name + ") var(--cipher-hue))"}
                color={colors.get(name + "@" + hue)}
                reference={"Lightness and chroma, hue " + hue}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Group({
  group,
  graph,
  colors
}: {
  group: ColorGroup;
  graph: TokenGraph;
  colors: ReadonlyMap<string, Rgba>;
}) {
  const tokens = group.sections.flatMap((section) => section.tokens).filter((name) => graph.nodes.has(name));
  return (
    <section className="flex flex-col gap-6 border-t border-(--cipher-line-soft) pt-8 first:border-t-0 first:pt-0">
      <header className="flex max-w-3xl flex-col gap-1">
        <h2 className="text-base font-medium">{group.title}</h2>
        <p className="m-0 text-sm text-(--cipher-muted)">{group.usage}</p>
      </header>
      {group.compositions.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-6">
          {group.compositions.map(({ title, tokens: used, Preview }) => (
            <figure key={title} className={styles.composition + " m-0"}>
              <figcaption className="text-xs font-medium text-(--cipher-text2)">{title}</figcaption>
              <Preview />
              <TokenLabels tokens={used} />
            </figure>
          ))}
        </div>
      )}
      {group.id === "hues" ? (
        <HueSwatches colors={colors} />
      ) : (
        <GroupSwatches tokens={tokens} graph={graph} colors={colors} />
      )}
    </section>
  );
}

export function IntentView({ graph, colors }: { graph: TokenGraph; colors: ReadonlyMap<string, Rgba> }) {
  const grouped = new Set(colorGroups.flatMap((group) => group.sections.flatMap((section) => section.tokens)));
  const unsorted = [...graph.nodes.values()]
    .filter((node) => node.kind !== "literal" && !grouped.has(node.id))
    .map((node) => node.id);
  const groups: ColorGroup[] = unsorted.length
    ? [
        ...colorGroups,
        {
          id: "other",
          title: "Not yet grouped",
          usage: "Color tokens added since this page was organized. Give each one a group in color-groups.tsx.",
          sections: [{ tokens: unsorted }],
          compositions: []
        }
      ]
    : colorGroups;
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <Group key={group.id} group={group} graph={graph} colors={colors} />
      ))}
    </div>
  );
}
