import tokens_default from "../tokens.js";
import { legacyThemes } from "./themes.js";
// src/lib/theme-registry.ts
var themes = tokens_default.themes.list;
var defaultTheme = {
	light: "light",
	dark: "dark"
};
/** A theme id from a stored, URL or hard-coded value; legacy peach and pale map to light, and legacy dark-alt to dark. */
var toTheme = (value) => {
	if (typeof value !== "string") return void 0;
	const id = legacyThemes[value] ?? value;
	return themes.some((theme) => theme.id === id) ? id : void 0;
};
var themeScheme = (id) => themes.find((theme) => theme.id === id)?.scheme ?? "light";
export { defaultTheme, themeScheme, themes, toTheme };

//# sourceMappingURL=theme-registry.js.map