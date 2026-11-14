import { useState } from "react";

import { colorGroups } from "./color-groups";
import { formatHex, nearness, type Rgba } from "./color-values";
import { ColorValues } from "./swatch";
import { chainOf, referenceText, rootsOf, type TokenGraph, type TokenNode, tokenUsage } from "./token-graph";

import styles from "./color.module.css";

const NODE_W = 190;
const NODE_H = 26;
const GAP = 6;
const COLUMN = NODE_W + 110;
const PAD = 16;

const groupOrder = new Map(
  colorGroups.flatMap((group) => group.sections.flatMap((section) => section.tokens)).map((name, index) => [name, index])
);
const orderOf = (id: string) => groupOrder.get(id) ?? Number.MAX_SAFE_INTEGER;
const mean = (values: readonly number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

/** Stacks one column at its targets without overlaps, top to bottom. */
const settle = (ids: readonly string[], target: (id: string) => number, y: Map<string, number>) => {
  let floor = PAD;
  [...ids]
    .sort((left, right) => target(left) - target(right))
    .forEach((id) => {
      const top = Math.max(target(id), floor);
      y.set(id, top);
      floor = top + NODE_H + GAP;
    });
};

const layout = (graph: TokenGraph) => {
  const connected = [...graph.nodes.values()].filter(
    (node) => node.parents.length || graph.children.get(node.id)?.length
  );
  const depth = Math.max(0, ...connected.map((node) => node.depth));
  const columns = Array.from({ length: depth + 1 }, (_, index) =>
    connected.filter((node) => node.depth === index).map((node) => node.id)
  );
  const y = new Map<string, number>();
  const rootRank = new Map(
    [...columns[0]]
      .sort((left, right) => orderOf(left) - orderOf(right) || left.localeCompare(right))
      .map((id, index) => [id, index])
  );
  const parentsOf = (id: string) => graph.nodes.get(id)?.parents ?? [];
  const firstColumn = [...(columns[1] ?? [])].sort((left, right) => {
    const rank = (id: string) => mean(parentsOf(id).map((parent) => rootRank.get(parent) ?? 0));
    return rank(left) - rank(right) || orderOf(left) - orderOf(right);
  });
  firstColumn.forEach((id, index) => y.set(id, PAD + index * (NODE_H + GAP)));
  settle(
    columns[0],
    (id) => {
      const placed = (graph.children.get(id) ?? []).filter((child) => y.has(child));
      return placed.length
        ? mean(placed.map((child) => y.get(child) as number))
        : PAD + (rootRank.get(id) ?? 0) * (NODE_H + GAP);
    },
    y
  );
  columns.slice(2).forEach((column) =>
    settle(column, (id) => mean(parentsOf(id).map((parent) => y.get(parent) ?? PAD)), y)
  );
  const x = (node: TokenNode) => PAD + node.depth * COLUMN;
  const height = Math.max(...[...y.values()]) + NODE_H + PAD;
  return { connected, y, x, width: PAD * 2 + depth * COLUMN + NODE_W, height };
};

const paintOf = (node: TokenNode) => (node.kind === "literal" ? node.raw : "var(--cipher-" + node.id + ")");

function Detail({
  graph,
  colors,
  id
}: {
  graph: TokenGraph;
  colors: ReadonlyMap<string, Rgba>;
  id: string | undefined;
}) {
  const node = id ? graph.nodes.get(id) : undefined;
  if (!node)
    return (
      <p className="m-0 text-sm text-(--cipher-muted)">
        Hover or select a token to trace it to its primitives and to every token built on it.
      </p>
    );
  const ground = colors.get("surface") ?? { r: 1, g: 1, b: 1, a: 1 };
  const color = colors.get(node.id);
  const near = color
    ? [...graph.nodes.values()]
        .filter((other) => other.id !== node.id && other.kind !== "literal" && colors.has(other.id))
        .map((other) => ({ id: other.id, distance: nearness(color, colors.get(other.id) as Rgba, ground) }))
        .filter((other) => other.distance < 1.5)
        .sort((left, right) => left.distance - right.distance)
    : [];
  const roots = rootsOf(graph, node.id).filter((root) => root !== node.id);
  const users = graph.children.get(node.id) ?? [];
  const facts: [string, React.ReactNode][] = [
    ["Usage", tokenUsage.get(node.id) ?? "Inline literal, not a token"],
    ["Source", <code key="source">{node.raw}</code>],
    ["Primitives", roots.length ? roots.join(", ") : "Itself"],
    ["Used by", users.length ? users.join(", ") : "No other token"],
    ["Near-identical", near.length ? near.map((other) => other.id + " (" + other.distance.toFixed(1) + ")").join(", ") : "None"]
  ];
  return (
    <div className="grid grid-cols-[14rem_1fr] gap-6">
      <div className="flex flex-col gap-2">
        <div className="relative h-10 border border-(--cipher-line-soft)">
          <div className="absolute inset-0" style={{ background: paintOf(node) }} />
        </div>
        <code className="text-sm">{node.label}</code>
        <span className="text-xs text-(--cipher-muted)">{referenceText(node)}</span>
        <ColorValues color={color} />
      </div>
      <dl className="m-0 grid grid-cols-[8rem_1fr] content-start gap-x-4 gap-y-2 text-sm">
        {facts.map(([term, value]) => (
          <div key={term} className="contents">
            <dt className="text-(--cipher-muted)">{term}</dt>
            <dd className="m-0 min-w-0 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PrimitivesView({ graph, colors }: { graph: TokenGraph; colors: ReadonlyMap<string, Rgba> }) {
  const [hovered, setHovered] = useState<string>();
  const [selected, setSelected] = useState<string>();
  const focus = hovered ?? selected;
  const chain = focus ? chainOf(graph, focus) : undefined;
  const { connected, y, x, width, height } = layout(graph);
  const standalone = [...graph.nodes.values()]
    .filter((node) => !node.parents.length && !graph.children.get(node.id)?.length)
    .sort((left, right) => orderOf(left.id) - orderOf(right.id));
  const roots = connected.filter((node) => !node.parents.length);
  return (
    <div className="flex flex-col gap-6">
      <p className="m-0 max-w-3xl text-sm text-(--cipher-muted)">
        {roots.length} primitives feed {connected.length - roots.length} tokens. Columns step one level of
        reference at a time, read from tokens.json for the current theme.
      </p>
      <div className="h-52 overflow-y-auto border border-(--cipher-line-soft) bg-(--cipher-surface) p-5">
        <Detail graph={graph} colors={colors} id={focus} />
      </div>
      <div className={styles.graph} >
        <div className="relative" style={{ width, height }}>
          <svg className="absolute inset-0" width={width} height={height} aria-hidden>
            {connected.flatMap((node) =>
              node.parents.map((parent) => {
                const from = graph.nodes.get(parent) as TokenNode;
                const x1 = x(from) + NODE_W;
                const y1 = (y.get(parent) ?? 0) + NODE_H / 2;
                const x2 = x(node);
                const y2 = (y.get(node.id) ?? 0) + NODE_H / 2;
                const bend = (x2 - x1) / 2;
                const lit = chain?.has(parent) && chain.has(node.id);
                return (
                  <path
                    key={parent + ">" + node.id}
                    className={styles.edge}
                    data-lit={lit || undefined}
                    data-dim={(chain && !lit) || undefined}
                    d={"M" + x1 + " " + y1 + " C" + (x1 + bend) + " " + y1 + " " + (x2 - bend) + " " + y2 + " " + x2 + " " + y2}
                  />
                );
              })
            )}
          </svg>
          {connected.map((node) => (
            <button
              key={node.id}
              type="button"
              className={styles.node}
              data-root={!node.parents.length || undefined}
              data-dim={(chain && !chain.has(node.id)) || undefined}
              data-selected={selected === node.id || undefined}
              aria-pressed={selected === node.id}
              style={{ left: x(node), top: y.get(node.id), width: NODE_W }}
              onPointerEnter={() => setHovered(node.id)}
              onPointerLeave={() => setHovered(undefined)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(undefined)}
              onClick={() => setSelected((current) => (current === node.id ? undefined : node.id))}
            >
              <span className={styles.dot}>
                <span className="absolute inset-0" style={{ background: paintOf(node) }} />
              </span>
              <span className="truncate">{node.label}</span>
            </button>
          ))}
        </div>
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Primitives no other token reuses ({standalone.length})</h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(13rem,1fr))] gap-x-6 gap-y-2 p-0">
          {standalone.map((node) => {
            const color = colors.get(node.id);
            return (
              <li key={node.id} className="flex items-center gap-2 text-xs">
                <span className={styles.dot}>
                  <span className="absolute inset-0" style={{ background: paintOf(node) }} />
                </span>
                <code>{node.label}</code>
                <span className="text-(--cipher-faint)">{color ? formatHex(color) : ""}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
