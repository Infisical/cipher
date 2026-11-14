// src/lib/hue.ts
/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue. Use subtle where several hues share a page and pop inside a single-hue scope. */
var hueScope = (hue, level = "subtle") => ({
	"data-hue": level,
	style: { "--cipher-hue": hue }
});
export { hueScope };

//# sourceMappingURL=hue.js.map