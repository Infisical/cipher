import * as React from "react";

import { useToastLayer } from "../scope";

const reserves = new WeakMap<HTMLElement, Map<object, number>>();

const publish = (layer: HTMLElement) => {
  const lift = Math.max(0, ...(reserves.get(layer)?.values() ?? []));
  if (lift) layer.style.setProperty("--cipher-toast-footer", `${lift}px`);
  else layer.style.removeProperty("--cipher-toast-footer");
};

/** An open overlay's footer lifts the toasts above itself whenever they would reach it, so a toast never covers its buttons. Returns the footer's ref. */
export function useToastFooterReserve<T extends HTMLElement>(ref: React.Ref<T> | undefined) {
  const layer = useToastLayer();
  const [node, setNode] = React.useState<T | null>(null);
  React.useLayoutEffect(() => {
    if (!layer || !node) return undefined;
    const key = {};
    const entries = reserves.get(layer) ?? new Map<object, number>();
    reserves.set(layer, entries);
    const measure = () => {
      const toasts = [...layer.querySelectorAll<HTMLElement>("[data-sonner-toast]")];
      const style = getComputedStyle(layer);
      const size = (token: string) => parseFloat(style.getPropertyValue(token)) || 0;
      const offset = size("--cipher-space-action-bar-offset");
      const base = layer.hasAttribute("data-action-bar-reserve")
        ? size("--cipher-size-action-bar") + 2 * offset
        : offset;
      const gap = size("--cipher-space-8");
      const stack = toasts.reduce((sum, toast) => sum + toast.offsetHeight + gap, base);
      const { top, bottom } = node.getBoundingClientRect();
      const covered = toasts.length > 0 && window.innerHeight - bottom < stack;
      entries.set(key, covered ? Math.max(0, window.innerHeight - top) : 0);
      publish(layer);
    };
    const panel = node.closest<HTMLElement>('[role="dialog"], [role="alertdialog"]') ?? node;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    observer.observe(panel);
    const toasts = new MutationObserver(measure);
    toasts.observe(layer, {
      childList: true,
      subtree: true,
      attributeFilter: ["data-action-bar-reserve"]
    });
    panel.addEventListener("animationend", measure);
    panel.addEventListener("transitionend", measure);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      toasts.disconnect();
      panel.removeEventListener("animationend", measure);
      panel.removeEventListener("transitionend", measure);
      window.removeEventListener("resize", measure);
      entries.delete(key);
      publish(layer);
    };
  }, [layer, node]);
  return React.useCallback(
    (value: T | null) => {
      setNode(value);
      if (typeof ref === "function") ref(value);
      else if (ref) ref.current = value;
    },
    [ref]
  );
}
