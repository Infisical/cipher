import type * as React from "react";

export type HueLevel = "subtle" | "pop";

/** Props that make an element a hue scope: its descendants read --v4-hue-icon, --v4-hue-tint and --v4-hue-soft built from this hue. Use subtle where several hues share a page and pop inside a single-hue scope. */
export const hueScope = (hue: number, level: HueLevel = "subtle") => ({
  "data-hue": level,
  style: { "--v4-hue": hue } as React.CSSProperties
});
