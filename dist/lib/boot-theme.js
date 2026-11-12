import { v4LiveOrgPath, v4ThemeStorage } from "./boot-theme-keys.js";
import { defaultV4Theme, toV4Theme, v4ThemeScheme } from "./theme-registry.js";
// src/lib/boot-theme.ts
var read = (storage, key) => {
	try {
		return storage().getItem(key);
	} catch {
		return null;
	}
};
/**
* The v4 theme for a location, from storage alone, for UI that renders before V4Scope and the
* React theme provider: a ?theme= or session preview outside live orgs, else the person's named
* theme for the scheme their shared preference resolves to.
*/
var readV4BootTheme = (location = window.location) => {
	if (!v4LiveOrgPath.test(location.pathname)) {
		const preview = toV4Theme(new URLSearchParams(location.search).get("theme")) ?? toV4Theme(read(() => window.sessionStorage, v4ThemeStorage.override));
		if (preview) return preview;
	}
	const shared = read(() => window.localStorage, v4ThemeStorage.shared);
	const choice = shared === "light" || shared === "dark" || shared === "system" ? shared : "dark";
	const systemLight = choice === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
	const scheme = choice === "light" || systemLight ? "light" : "dark";
	let preferred = {};
	try {
		preferred = JSON.parse(read(() => window.localStorage, v4ThemeStorage.preferred) || "{}");
	} catch {
		preferred = {};
	}
	const named = toV4Theme(preferred[scheme]);
	return named && v4ThemeScheme(named) === scheme ? named : defaultV4Theme[scheme];
};
export { readV4BootTheme, v4LiveOrgPath, v4ThemeStorage };

//# sourceMappingURL=boot-theme.js.map