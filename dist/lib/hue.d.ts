import type * as React from "react";
export type HueLevel = "subtle" | "pop";
/** The accent, its hover step and the text on them for a hue. The accent sits at the lightest oklch point where the hue holds the brand chroma (clamped to 0.7 to 0.917), so the brand hue lands on Infisical yellow exactly; pass lightness to pin a darker accent. The text is near-black or white, whichever keeps the higher contrast on the worst of the fill, the hover step and the lightest stop of the button material. */
export declare const accentRamp: (hue: number, lightness?: number) => {
    accent: string;
    accent2: string;
    on: string;
};
/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue, and the accent (accent, accent-2, accent-wash, accent-line, accent-fg and the accent button material) follows it too. Use subtle where several hues share a page and pop inside a single-hue scope. Outside every scope the accent is Infisical yellow. */
export declare const hueScope: (hue: number, level?: HueLevel, options?: {
    lightness?: number;
}) => {
    "data-hue": HueLevel;
    style: React.CSSProperties;
};
