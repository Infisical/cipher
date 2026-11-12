import { type V4Scheme, type V4ThemeDefinition } from "./themes";
export declare const v4Themes: readonly V4ThemeDefinition[];
export declare const defaultV4Theme: Readonly<Record<V4Scheme, string>>;
/** A theme id from a stored, URL or hard-coded value; legacy light maps to peach, and legacy dark-alt to dark. */
export declare const toV4Theme: (value: unknown) => string | undefined;
export declare const v4ThemeScheme: (id: string) => V4Scheme;
