export type Scheme = "light" | "dark";
export interface ThemeDefinition {
    id: string;
    name: string;
    scheme: Scheme;
    base?: Scheme;
    extends?: string;
    overrides: Readonly<Record<string, string>>;
}
export declare const legacyThemes: Readonly<Record<string, string>>;
/** The theme and every theme it extends, nearest first, plus the base column the chain ends on. */
export declare const themeChain: (themes: readonly ThemeDefinition[], id: string) => {
    chain: ThemeDefinition[];
    base: Scheme;
};
/** A themed token's raw value in a theme: the nearest override, then the base column. */
export declare const themedValue: (themes: readonly ThemeDefinition[], id: string, name: string, value: Readonly<Record<string, string>>) => string;
