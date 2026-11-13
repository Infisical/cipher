import { type ThemeStorageKeys, themeStorage } from "./boot-theme-keys";
import { defaultTheme, toTheme, themeScheme } from "./theme-registry";
import type { Scheme } from "./themes";

export { type ThemeStorageKeys, themeStorage };

const read = (storage: () => Storage, key: string) => {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
};

/**
 * The theme from storage alone, for UI that renders before CipherScope and the React theme
 * provider: a ?theme= or session preview when `allowPreview` is set, else the person's named theme
 * for the scheme their shared preference resolves to.
 */
export const readBootTheme = ({
  keys = themeStorage,
  allowPreview = true,
  search = window.location.search
}: { keys?: ThemeStorageKeys; allowPreview?: boolean; search?: string } = {}): string => {
  if (allowPreview) {
    const preview =
      toTheme(new URLSearchParams(search).get("theme")) ??
      toTheme(read(() => window.sessionStorage, keys.override));
    if (preview) return preview;
  }
  const shared = read(() => window.localStorage, keys.shared);
  const choice = shared === "light" || shared === "dark" || shared === "system" ? shared : "dark";
  const systemLight =
    choice === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  const scheme: Scheme = choice === "light" || systemLight ? "light" : "dark";
  let preferred: Partial<Record<Scheme, unknown>> = {};
  try {
    preferred = JSON.parse(read(() => window.localStorage, keys.preferred) || "{}");
  } catch {
    preferred = {};
  }
  const named = toTheme(preferred[scheme]);
  return named && themeScheme(named) === scheme ? named : defaultTheme[scheme];
};
