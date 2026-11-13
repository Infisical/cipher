import type * as React from "react";

export type HueLevel = "subtle" | "pop";

/** Props that make an element a hue scope: its descendants read --cipher-hue-icon, --cipher-hue-tint, --cipher-hue-soft and --cipher-hue-fill built from this hue. Use subtle where several hues share a page and pop inside a single-hue scope. */
export const hueScope = (hue: number, level: HueLevel = "subtle") => ({
  "data-hue": level,
  style: { "--cipher-hue": hue } as React.CSSProperties
});
