// src/lib/boot-theme-keys.ts
/** Storage keys the app theme reads: the shared light, dark or system preference, the named theme per scheme, and a demo preview. */
var v4ThemeStorage = {
	shared: "infisical-theme",
	preferred: "v4-theme",
	override: "v4-theme-override"
};
/** A live org route: /v4/organizations/<id> with an id other than the demo org. */
var v4LiveOrgPath = /^\/v4\/organizations\/(?!demo(?:\/|$))[^/]+/;
export { v4LiveOrgPath, v4ThemeStorage };

//# sourceMappingURL=boot-theme-keys.js.map