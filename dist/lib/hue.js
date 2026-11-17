// src/lib/hue.ts
var BRAND = {
	l: .917,
	c: .183
};
var STEP = .05;
var toLinearRgb = (l, c, hue) => {
	const a = c * Math.cos(hue * Math.PI / 180);
	const b = c * Math.sin(hue * Math.PI / 180);
	const lms = [
		l + .3963377774 * a + .2158037573 * b,
		l - .1055613458 * a - .0638541728 * b,
		l - .0894841775 * a - 1.291485548 * b
	].map((value) => value ** 3);
	return [
		4.0767416621 * lms[0] - 3.3077115913 * lms[1] + .2309699292 * lms[2],
		-1.2684380046 * lms[0] + 2.6097574011 * lms[1] - .3413193965 * lms[2],
		-.0041960863 * lms[0] - .7034186147 * lms[1] + 1.707614701 * lms[2]
	];
};
var maxChroma = (l, hue) => {
	let low = 0;
	let high = .4;
	for (let i = 0; i < 24; i += 1) {
		const mid = (low + high) / 2;
		if (toLinearRgb(l, mid, hue).every((value) => value >= 0 && value <= 1)) low = mid;
		else high = mid;
	}
	return low;
};
var luminance = (l, c, hue) => {
	const [r, g, b] = toLinearRgb(l, c, hue).map((value) => Math.min(1, Math.max(0, value)));
	return .2126 * r + .7152 * g + .0722 * b;
};
var encode = (value) => value <= .0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - .055;
var decode = (value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
var mixedWithWhite = (l, c, hue, amount) => {
	const [r, g, b] = toLinearRgb(l, c, hue).map((value) => decode(encode(Math.min(1, Math.max(0, value))) * amount + (1 - amount)));
	return .2126 * r + .7152 * g + .0722 * b;
};
var contrast = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
var INK = 3e-4;
var ramps = /* @__PURE__ */ new Map();
/** The accent, its hover step and the text on them for a hue. The accent sits at the lightest oklch point where the hue holds the brand chroma (clamped to 0.7 to 0.917), so the brand hue lands on Infisical yellow exactly; pass lightness to pin a darker accent. The text is near-black or white, whichever keeps the higher contrast on the worst of the fill, the hover step and the lightest stop of the button material. */
var accentRamp = (hue, lightness) => {
	const key = `${hue}:${lightness ?? ""}`;
	const cached = ramps.get(key);
	if (cached) return cached;
	let cusp = BRAND.l;
	let best = 0;
	for (let l = BRAND.l; l >= .5; l -= .005) {
		const chroma = maxChroma(l, hue);
		if (chroma >= BRAND.c) {
			cusp = l;
			break;
		}
		if (chroma > best) {
			best = chroma;
			cusp = l;
		}
	}
	const l = lightness ?? Math.max(.7, cusp);
	const c = Math.min(BRAND.c, maxChroma(l, hue));
	const l2 = l - STEP;
	const c2 = Math.min(c, maxChroma(l2, hue));
	const fills = [
		luminance(l, c, hue),
		luminance(l2, c2, hue),
		mixedWithWhite(l, c, hue, .78)
	];
	const worst = (text) => Math.min(...fills.map((fill) => contrast(fill, text)));
	const ramp = {
		accent: `${l.toFixed(3)} ${c.toFixed(3)}`,
		accent2: `${l2.toFixed(3)} ${c2.toFixed(3)}`,
		on: worst(1) > worst(INK) ? "#ffffff" : "#010101"
	};
	ramps.set(key, ramp);
	return ramp;
};
/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue, and the accent (accent, accent-2, accent-wash, accent-line, accent-fg and the accent button material) follows it too. Use subtle where several hues share a page and pop inside a single-hue scope. Outside every scope the accent is Infisical yellow. */
var hueScope = (hue, level = "subtle", options = {}) => {
	const { accent, accent2, on } = accentRamp(hue, options.lightness);
	return {
		"data-hue": level,
		style: {
			"--cipher-hue": hue,
			"--cipher-accent-lc": accent,
			"--cipher-accent-2-lc": accent2,
			"--cipher-accent-on": on
		}
	};
};
export { accentRamp, hueScope };

//# sourceMappingURL=hue.js.map