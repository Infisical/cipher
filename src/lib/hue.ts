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

const ramps = new Map<number, string[]>();

/** The accent and its hover step for a hue as oklch lightness and chroma pairs. Each sits at the lightest point where the hue holds the brand chroma (clamped to 0.7 to 0.917), so near-black on-accent passes AAA on every hue and the brand hue lands on Infisical yellow exactly. */
export const accentRamp = (hue: number) => {
  const cached = ramps.get(hue);
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
  const l = Math.max(0.7, cusp);
  const c = Math.min(BRAND.c, maxChroma(l, hue));
  const l2 = l - STEP;
  const ramp = [l, c, l2, Math.min(c, maxChroma(l2, hue))].map((value) => value.toFixed(3));
  const pairs = [`${ramp[0]} ${ramp[1]}`, `${ramp[2]} ${ramp[3]}`];
  ramps.set(hue, pairs);
  return pairs;
};

/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue, and the accent (accent, accent-2, accent-wash, accent-line, accent-fg and the accent button material) follows it too. Use subtle where several hues share a page and pop inside a single-hue scope. Outside every scope the accent is Infisical yellow. */
export const hueScope = (hue: number, level: HueLevel = "subtle") => {
  const [accent, accent2] = accentRamp(hue);
  return {
    "data-hue": level,
    style: {
      "--cipher-hue": hue,
      "--cipher-accent-lc": accent,
      "--cipher-accent-2-lc": accent2
    } as React.CSSProperties
  };
};
