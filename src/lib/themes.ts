export type Scheme = "light" | "dark";

export interface ThemeDefinition {
  id: string;
  name: string;
  scheme: Scheme;
  base?: Scheme;
  extends?: string;
  overrides: Readonly<Record<string, string>>;
}

export const legacyThemes: Readonly<Record<string, string>> = {
  peach: "light",
  pale: "light",
  "dark-alt": "dark"
};

/** The theme and every theme it extends, nearest first, plus the base column the chain ends on. */
export const themeChain = (themes: readonly ThemeDefinition[], id: string) => {
  const chain: ThemeDefinition[] = [];
  let current = themes.find((theme) => theme.id === id);
  while (current) {
    if (chain.includes(current)) throw new Error(`Theme ${id} extends itself`);
    chain.push(current);
    if (current.base) return { chain, base: current.base };
    const parent = current.extends;
    current = themes.find((theme) => theme.id === parent);
    if (!current)
      throw new Error(`Theme ${chain[chain.length - 1].id} extends unknown theme ${parent}`);
  }
  throw new Error(`Unknown theme ${id}`);
};

/** A themed token's raw value in a theme: the nearest override, then the base column. */
export const themedValue = (
  themes: readonly ThemeDefinition[],
  id: string,
  name: string,
  value: Readonly<Record<string, string>>
) => {
  const { chain, base } = themeChain(themes, id);
  const override = chain.find((theme) => name in theme.overrides)?.overrides[name];
  return override ?? value[base] ?? value.light;
};
