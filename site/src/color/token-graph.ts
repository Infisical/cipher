import tokens from "@infisical/cipher/tokens.json";
import { themes } from "@infisical/cipher/lib/theme-registry";
import { themedValue } from "@infisical/cipher/lib/themes";

type RawToken = { name: string; value: unknown; usage?: string };
type Family = { note?: string; tokens?: RawToken[] };

export type TokenKind = "primitive" | "alias" | "mix" | "literal";

export type TokenNode = {
  id: string;
  label: string;
  family: string;
  kind: TokenKind;
  raw: string;
  parents: string[];
  params: string[];
  depth: number;
};

export type TokenGraph = {
  nodes: Map<string, TokenNode>;
  children: Map<string, string[]>;
};

const refPattern = /\{([^}]+)\}/g;
const literalPattern = /#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b/gi;
const colorPattern = /^(?:#[0-9a-f]{3,8}|rgba?\(.*\)|color-mix\(.*\)|oklch\(.*\)|transparent)$/i;

const families = tokens as unknown as Record<string, Family>;

const themedTokens = Object.entries(families).flatMap(([family, group]) =>
  Array.isArray(group?.tokens)
    ? group.tokens
        .filter(
          (token): token is RawToken & { value: Record<string, string> } =>
            typeof token.value === "object" && token.value !== null
        )
        .map((token) => ({ ...token, family }))
    : []
);

const refsOf = (raw: string) => [...raw.matchAll(refPattern)].map((match) => match[1]);
const isSingleRef = (raw: string, refs: string[]) =>
  refs.length === 1 && raw.trim() === "{" + refs[0] + "}";

export const literalId = (value: string) => "literal:" + value.toLowerCase();

/** Every themed token whose value is a color in this theme, after following references. */
const colorTokens = (theme: string) => {
  const raw = new Map(
    themedTokens.map((token) => [token.name, themedValue(themes, theme, token.name, token.value)])
  );
  const colors = new Set<string>();
  let grew = true;
  while (grew) {
    grew = false;
    raw.forEach((value, name) => {
      if (colors.has(name)) return;
      const refs = refsOf(value);
      const isColor = isSingleRef(value, refs)
        ? colors.has(refs[0])
        : colorPattern.test(value.replace(refPattern, "#000").trim());
      if (!isColor) return;
      colors.add(name);
      grew = true;
    });
  }
  return { raw, colors };
};

/** The color tokens of one theme, parsed from tokens.json: literal colors are the roots and every reference is an edge from the token it names. */
export const buildTokenGraph = (theme: string): TokenGraph => {
  const { raw, colors } = colorTokens(theme);
  const nodes = new Map<string, TokenNode>();
  themedTokens
    .filter((token) => colors.has(token.name))
    .forEach((token) => {
      const value = raw.get(token.name) ?? "";
      const refs = refsOf(value);
      const literals = refs.length
        ? [...value.replace(refPattern, "").matchAll(literalPattern)].map((match) => match[0])
        : [];
      literals.forEach((literal) => {
        const id = literalId(literal);
        if (nodes.has(id)) return;
        nodes.set(id, {
          id,
          label: literal,
          family: "literal",
          kind: "literal",
          raw: literal,
          parents: [],
          params: [],
          depth: 0
        });
      });
      nodes.set(token.name, {
        id: token.name,
        label: token.name,
        family: token.family,
        kind: !refs.length ? "primitive" : isSingleRef(value, refs) ? "alias" : "mix",
        raw: value,
        parents: [...refs.filter((ref) => colors.has(ref)), ...literals.map(literalId)],
        params: refs.filter((ref) => !colors.has(ref)),
        depth: 0
      });
    });
  const children = new Map<string, string[]>();
  nodes.forEach((node) =>
    node.parents.forEach((parent) =>
      children.set(parent, [...(children.get(parent) ?? []), node.id])
    )
  );
  const depthOf = (id: string, seen: readonly string[]): number => {
    const node = nodes.get(id);
    if (!node?.parents.length || seen.includes(id)) return 0;
    return 1 + Math.max(...node.parents.map((parent) => depthOf(parent, [...seen, id])));
  };
  nodes.forEach((node) => {
    node.depth = depthOf(node.id, []);
  });
  return { nodes, children };
};

/** A node with its ancestors and descendants: the chain a hover highlights. */
export const chainOf = (graph: TokenGraph, id: string) => {
  const chain = new Set<string>([id]);
  const walk = (next: (node: string) => readonly string[]) => {
    const stack = [id];
    while (stack.length) {
      next(stack.pop() as string).forEach((other) => {
        if (chain.has(other)) return;
        chain.add(other);
        stack.push(other);
      });
    }
  };
  walk((node) => graph.nodes.get(node)?.parents ?? []);
  walk((node) => graph.children.get(node) ?? []);
  return chain;
};

/** The primitives a token ends on, through every level of alias. */
export const rootsOf = (graph: TokenGraph, id: string): string[] => {
  const node = graph.nodes.get(id);
  if (!node) return [];
  if (!node.parents.length) return [id];
  return [...new Set(node.parents.flatMap((parent) => rootsOf(graph, parent)))];
};

export function referenceText(node: TokenNode | undefined) {
  if (!node) return undefined;
  if (node.kind === "alias") return "Alias of " + node.parents[0];
  if (node.kind === "mix")
    return "Mix of " + node.parents.map((parent) => parent.replace(/^literal:/, "")).join(", ");
  return "Primitive";
}

export const tokenUsage = new Map(themedTokens.map((token) => [token.name, token.usage]));

export const hueRamp = {
  note: families.hue?.note ?? "",
  names: (families.hue?.tokens ?? []).map((token) => token.name)
};
