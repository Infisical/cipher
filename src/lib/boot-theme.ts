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
 * for the scheme their shared preference resolves to. With no stored preference it follows the OS
 * scheme. A single key is read as the shared light, dark or system preference.
 */
export const readBootTheme = ({
  keys: keysOption = themeStorage,
  allowPreview = true,
  search = window.location.search
}: { keys?: ThemeStorageKeys | string; allowPreview?: boolean; search?: string } = {}): string => {
  const keys: Partial<ThemeStorageKeys> & { shared: string } =
    typeof keysOption === "string" ? { shared: keysOption } : keysOption;
  if (allowPreview) {
    const preview =
      toTheme(new URLSearchParams(search).get("theme")) ??
      (keys.override ? toTheme(read(() => window.sessionStorage, keys.override)) : undefined);
    if (preview) return preview;
  }
  const shared = read(() => window.localStorage, keys.shared);
  const choice = shared === "light" || shared === "dark" ? shared : "system";
  const systemLight =
    choice === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  const scheme: Scheme = choice === "light" || systemLight ? "light" : "dark";
  let preferred: Partial<Record<Scheme, unknown>> = {};
  try {
    preferred = JSON.parse((keys.preferred && read(() => window.localStorage, keys.preferred)) || "{}");
  } catch {
    preferred = {};
  }
  const named = toTheme(preferred[scheme]);
  return named && themeScheme(named) === scheme ? named : defaultTheme[scheme];
};
