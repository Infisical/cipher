import { themeStorage } from "./boot-theme-keys.js";
import { defaultTheme, themeScheme, toTheme } from "./theme-registry.js";
// src/lib/boot-theme.ts
var read = (storage, key) => {
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
var readBootTheme = ({ keys: keysOption = themeStorage, allowPreview = true, search = window.location.search } = {}) => {
	const keys = typeof keysOption === "string" ? { shared: keysOption } : keysOption;
	if (allowPreview) {
		const preview = toTheme(new URLSearchParams(search).get("theme")) ?? (keys.override ? toTheme(read(() => window.sessionStorage, keys.override)) : void 0);
		if (preview) return preview;
	}
	const shared = read(() => window.localStorage, keys.shared);
	const choice = shared === "light" || shared === "dark" ? shared : "system";
	const systemLight = choice === "system" && window.matchMedia("(prefers-color-scheme: light)").matches;
	const scheme = choice === "light" || systemLight ? "light" : "dark";
	let preferred = {};
	try {
		preferred = JSON.parse(keys.preferred && read(() => window.localStorage, keys.preferred) || "{}");
	} catch {
		preferred = {};
	}
	const named = toTheme(preferred[scheme]);
	return named && themeScheme(named) === scheme ? named : defaultTheme[scheme];
};
export { readBootTheme, themeStorage };

//# sourceMappingURL=boot-theme.js.map