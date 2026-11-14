export type Rgba = { r: number; g: number; b: number; a: number };

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

const oklabToRgb = (l: number, a: number, b: number) => {
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
  ].map((channel) => clamp(fromLinear(channel)));
};

export const toOklab = ({ r, g, b }: Rgba) => {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363015264 * lg + 0.0514770028 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  };
};

const number = (part: string, scale = 1) =>
  part.endsWith("%") ? (parseFloat(part) / 100) * scale : parseFloat(part);

/** Parses the color forms a browser returns from getComputedStyle: rgb(), color(srgb), oklab() and oklch(). */
export const parseColor = (value: string): Rgba | undefined => {
  const match = value.trim().match(/^([a-z-]+)\((.*)\)$/i);
  if (!match) return value.trim() === "transparent" ? { r: 0, g: 0, b: 0, a: 0 } : undefined;
  const [, fn, body] = match;
  const [channels, alphaPart] = body.replace(/,/g, " ").split("/");
  const parts = channels.trim().split(/\s+/);
  const alpha = (fallback?: string) => {
    const raw = alphaPart?.trim() ?? fallback;
    return raw === undefined || raw === "none" ? 1 : clamp(number(raw));
  };
  if (fn === "rgb" || fn === "rgba") {
    const [r, g, b] = parts.slice(0, 3).map((part) => clamp(number(part, 255) / 255));
    return { r, g, b, a: alpha(parts[3]) };
  }
  if (fn === "color" && parts[0] === "srgb") {
    const [r, g, b] = parts.slice(1, 4).map((part) => clamp(number(part)));
    return { r, g, b, a: alpha() };
  }
  if (fn === "oklab") {
    const [r, g, b] = oklabToRgb(number(parts[0]), number(parts[1], 0.4), number(parts[2], 0.4));
    return { r, g, b, a: alpha() };
  }
  if (fn === "oklch") {
    const chroma = number(parts[1], 0.4);
    const hue = ((parseFloat(parts[2]) || 0) * Math.PI) / 180;
    const [r, g, b] = oklabToRgb(number(parts[0]), chroma * Math.cos(hue), chroma * Math.sin(hue));
    return { r, g, b, a: alpha() };
  }
  return undefined;
};

const byte = (channel: number) => Math.round(channel * 255);
const hex2 = (channel: number) => byte(channel).toString(16).padStart(2, "0");
const trim = (value: number, digits: number) => String(Number(value.toFixed(digits)));

export const formatHex = (color: Rgba) =>
  "#" + hex2(color.r) + hex2(color.g) + hex2(color.b) + (color.a < 1 ? hex2(color.a) : "");

export const formatRgb = (color: Rgba) =>
  color.a < 1
    ? "rgb(" + byte(color.r) + " " + byte(color.g) + " " + byte(color.b) + " / " + trim(color.a, 3) + ")"
    : "rgb(" + byte(color.r) + " " + byte(color.g) + " " + byte(color.b) + ")";

export const formatOklch = (color: Rgba) => {
  const { l, a, b } = toOklab(color);
  const chroma = Math.hypot(a, b);
  const hue = chroma < 0.0005 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  const body = trim(l, 3) + " " + trim(chroma, 3) + " " + trim(hue, 1);
  return "oklch(" + body + (color.a < 1 ? " / " + trim(color.a, 3) : "") + ")";
};

/** The color as it reads painted over a ground, so translucent tokens compare by what people see. */
export const over = (color: Rgba, ground: Rgba): Rgba => ({
  r: color.r * color.a + ground.r * (1 - color.a),
  g: color.g * color.a + ground.g * (1 - color.a),
  b: color.b * color.a + ground.b * (1 - color.a),
  a: 1
});

/** Distance in OKLab, scaled by 100 so 1 is roughly the smallest step people notice side by side. */
export const deltaE = (left: Rgba, right: Rgba) => {
  const a = toOklab(left);
  const b = toOklab(right);
  return Math.hypot(a.l - b.l, a.a - b.a, a.b - b.b) * 100;
};

/** How alike two tokens read on a ground: deltaE of what is painted, and never alike when one is clearly more translucent than the other. */
export const nearness = (left: Rgba, right: Rgba, ground: Rgba) =>
  Math.abs(left.a - right.a) > 0.05 ? Infinity : deltaE(over(left, ground), over(right, ground));
