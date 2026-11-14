import { type Scheme, type ThemeDefinition } from "./themes";
export declare const themes: readonly ThemeDefinition[];
export declare const defaultTheme: Readonly<Record<Scheme, string>>;
/** A theme id from a stored, URL or hard-coded value; legacy peach and pale map to light, and legacy dark-alt to dark. */
export declare const toTheme: (value: unknown) => string | undefined;
export declare const themeScheme: (id: string) => Scheme;
