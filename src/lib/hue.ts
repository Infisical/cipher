import type * as React from "react";

export type HueLevel = "subtle" | "pop";

const BRAND = { l: 0.917, c: 0.183 };
const STEP = 0.05;

const toLinearRgb = (l: number, c: number, hue: number) => {
  const a = c * Math.cos((hue * Math.PI) / 180);
  const b = c * Math.sin((hue * Math.PI) / 180);
  const lms = [
    l + 0.3963377774 * a + 0.2158037573 * b,
    l - 0.1055613458 * a - 0.0638541728 * b,
    l - 0.0894841775 * a - 1.291485548 * b
  ].map((value) => value ** 3);
  return [
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2],
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2],
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2]
  ];
};

const maxChroma = (l: number, hue: number) => {
  let low = 0;
  let high = 0.4;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (toLinearRgb(l, mid, hue).every((value) => value >= 0 && value <= 1)) low = mid;
    else high = mid;
  }
  return low;
};

const luminance = (l: number, c: number, hue: number) => {
  const [r, g, b] = toLinearRgb(l, c, hue).map((value) => Math.min(1, Math.max(0, value)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const encode = (value: number) =>
  value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055;
const decode = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
const mixedWithWhite = (l: number, c: number, hue: number, amount: number) => {
  const [r, g, b] = toLinearRgb(l, c, hue).map((value) =>
    decode(encode(Math.min(1, Math.max(0, value))) * amount + (1 - amount))
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const INK = 0.0003;

const ramps = new Map<string, { accent: string; accent2: string; on: string }>();

/** The accent, its hover step and the text on them for a hue. The accent sits at the lightest oklch point where the hue holds the brand chroma (clamped to 0.7 to 0.917), so the brand hue lands on Infisical yellow exactly; pass lightness to pin a darker accent. The text is near-black or white, whichever keeps the higher contrast on the worst of the fill, the hover step and the lightest stop of the button material. */
export const accentRamp = (hue: number, lightness?: number) => {
  const key = `${hue}:${lightness ?? ""}`;
  const cached = ramps.get(key);
  if (cached) return cached;
  let cusp = BRAND.l;
  let best = 0;
  for (let l = BRAND.l; l >= 0.5; l -= 0.005) {
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
  const l = lightness ?? Math.max(0.7, cusp);
  const c = Math.min(BRAND.c, maxChroma(l, hue));
  const l2 = l - STEP;
  const c2 = Math.min(c, maxChroma(l2, hue));
  const fills = [luminance(l, c, hue), luminance(l2, c2, hue), mixedWithWhite(l, c, hue, 0.78)];
  const worst = (text: number) => Math.min(...fills.map((fill) => contrast(fill, text)));
  const ramp = {
    accent: `${l.toFixed(3)} ${c.toFixed(3)}`,
    accent2: `${l2.toFixed(3)} ${c2.toFixed(3)}`,
    on: worst(1) > worst(INK) ? "#ffffff" : "#010101"
  };
  ramps.set(key, ramp);
  return ramp;
};

/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue, and the accent (accent, accent-2, accent-wash, accent-line, accent-fg and the accent button material) follows it too. Use subtle where several hues share a page and pop inside a single-hue scope. Outside every scope the accent is Infisical yellow. */
export const hueScope = (
  hue: number,
  level: HueLevel = "subtle",
  options: { lightness?: number } = {}
) => {
  const { accent, accent2, on } = accentRamp(hue, options.lightness);
  return {
    "data-hue": level,
    style: {
      "--cipher-hue": hue,
      "--cipher-accent-lc": accent,
      "--cipher-accent-2-lc": accent2,
      "--cipher-accent-on": on
    } as React.CSSProperties
  };
};
