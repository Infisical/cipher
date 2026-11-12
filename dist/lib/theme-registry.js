import tokens_default from "../tokens.js";
import { legacyV4Themes } from "./themes.js";
// src/lib/theme-registry.ts
var v4Themes = tokens_default.themes.list;
var defaultV4Theme = {
	light: "peach",
	dark: "dark"
};
/** A theme id from a stored, URL or hard-coded value; legacy light maps to peach, and legacy dark-alt to dark. */
var toV4Theme = (value) => {
	if (typeof value !== "string") return void 0;
	const id = legacyV4Themes[value] ?? value;
	return v4Themes.some((theme) => theme.id === id) ? id : void 0;
};
var v4ThemeScheme = (id) => v4Themes.find((theme) => theme.id === id)?.scheme ?? "light";
export { defaultV4Theme, toV4Theme, v4ThemeScheme, v4Themes };

//# sourceMappingURL=theme-registry.js.map