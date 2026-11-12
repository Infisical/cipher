export type V4Scheme = "light" | "dark";
export interface V4ThemeDefinition {
    id: string;
    name: string;
    scheme: V4Scheme;
    base?: V4Scheme;
    extends?: string;
    overrides: Readonly<Record<string, string>>;
}
export declare const legacyV4Themes: Readonly<Record<string, string>>;
/** The theme and every theme it extends, nearest first, plus the base column the chain ends on. */
export declare const v4ThemeChain: (themes: readonly V4ThemeDefinition[], id: string) => {
    chain: V4ThemeDefinition[];
    base: V4Scheme;
};
/** A themed token's raw value in a theme: the nearest override, then the base column. */
export declare const v4ThemedValue: (themes: readonly V4ThemeDefinition[], id: string, name: string, value: Readonly<Record<string, string>>) => string;
