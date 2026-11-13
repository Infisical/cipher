import { liveOrgPath, themeStorage } from "./boot-theme-keys";
import { defaultTheme, toTheme, themeScheme } from "./theme-registry";
import type { Scheme } from "./themes";

export { liveOrgPath, themeStorage };

const read = (storage: () => Storage, key: string) => {
  try {
    return storage().getItem(key);
  } catch {
    return null;
  }
};

/**
 * The v4 theme for a location, from storage alone, for UI that renders before CipherScope and the
 * React theme provider: a ?theme= or session preview outside live orgs, else the person's named
 * theme for the scheme their shared preference resolves to.
 */
export const readBootTheme = (
  location: Pick<Location, "pathname" | "search"> = window.location
): string => {
  if (!liveOrgPath.test(location.pathname)) {
    const preview =
      toTheme(new URLSearchParams(location.search).get("theme")) ??
      toTheme(read(() => window.sessionStorage, themeStorage.override));
    if (preview) return preview;
  }
  const shared = read(() => window.localStorage, themeStorage.shared);
  const choice = shared === "light" || shared === "dark" || shared === "system" ? shared : "dark";
  const systemLight =
    choice === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
  const scheme: Scheme = choice === "light" || systemLight ? "light" : "dark";
  let preferred: Partial<Record<Scheme, unknown>> = {};
  try {
    preferred = JSON.parse(read(() => window.localStorage, themeStorage.preferred) || "{}");
  } catch {
    preferred = {};
  }
  const named = toTheme(preferred[scheme]);
  return named && themeScheme(named) === scheme ? named : defaultTheme[scheme];
};
