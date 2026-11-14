import { useLayoutEffect, useRef, useState } from "react";

import { parseColor, type Rgba } from "./color-values";

export type Probe = { key: string; css: string; hue?: number; level?: "subtle" | "pop" };

/** Reads each probe's computed color inside the current Cipher scope, again whenever the theme changes. */
export function useComputedColors(theme: string | undefined, probes: readonly Probe[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [colors, setColors] = useState<ReadonlyMap<string, Rgba>>(() => new Map());
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    const elements = probes.map((probe) => {
      const element = document.createElement("div");
      if (probe.hue !== undefined) {
        element.dataset.hue = probe.level ?? "subtle";
        element.style.setProperty("--cipher-hue", String(probe.hue));
      }
      element.style.backgroundColor = probe.css;
      host.append(element);
      return element;
    });
    const next = new Map<string, Rgba>();
    elements.forEach((element, index) => {
      const color = parseColor(getComputedStyle(element).backgroundColor);
      if (color) next.set(probes[index].key, color);
    });
    elements.forEach((element) => element.remove());
    setColors(next);
  }, [theme, probes]);
  return { ref, colors };
}
