import { v4LiveOrgPath, v4ThemeStorage } from "./boot-theme-keys";
export { v4LiveOrgPath, v4ThemeStorage };
/**
 * The v4 theme for a location, from storage alone, for UI that renders before V4Scope and the
 * React theme provider: a ?theme= or session preview outside live orgs, else the person's named
 * theme for the scheme their shared preference resolves to.
 */
export declare const readV4BootTheme: (location?: Pick<Location, "pathname" | "search">) => string;
