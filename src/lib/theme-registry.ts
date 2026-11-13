import tokens from "../tokens.json";
import { legacyThemes, type Scheme, type ThemeDefinition } from "./themes";

export const themes = tokens.themes.list as unknown as readonly ThemeDefinition[];

export const defaultTheme: Readonly<Record<Scheme, string>> = { light: "light", dark: "dark" };

/** A theme id from a stored, URL or hard-coded value; legacy peach and pale map to light, and legacy dark-alt to dark. */
export const toTheme = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const id = legacyThemes[value] ?? value;
  return themes.some((theme) => theme.id === id) ? id : undefined;
};

export const themeScheme = (id: string): Scheme =>
  themes.find((theme) => theme.id === id)?.scheme ?? "light";
