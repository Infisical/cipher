import * as React from "react";

import { cn } from "../lib/utils";

import styles from "./text.module.css";

let ruler: CanvasRenderingContext2D | null | undefined;

function rulerFor(node: HTMLElement) {
  if (ruler === undefined) ruler = document.createElement("canvas").getContext("2d");
  if (!ruler) return null;
  const style = getComputedStyle(node);
  ruler.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ruler.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  ruler.fontKerning = style.fontKerning === "none" ? "none" : "normal";
  return ruler;
}

export function MiddleTruncate({
  children,
  text,
  keepEnd = 8,
  mono = false,
  title,
  className,
  onCopy,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"span">, "children" | "title"> & {
  children?: string;
  text?: string;
  keepEnd?: number;
  mono?: boolean;
  title?: string | false;
} & { ref?: React.Ref<HTMLSpanElement> }) {
  const value = text ?? children ?? "";
  const host = React.useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = React.useState(value);
  React.useImperativeHandle(ref, () => host.current!, []);
  React.useLayoutEffect(() => {
    const node = host.current;
    if (!node) return;
    let alive = true;
    let fitted = -1;
    const fit = (width: number) => {
      if (!alive || width === fitted) return;
      fitted = width;
      const context = width ? rulerFor(node) : null;
      if (!context) {
        setVisible(value);
        return;
      }
      const fits = (candidate: string) => context.measureText(candidate).width <= width;
      if (fits(value)) {
        setVisible(value);
        return;
      }
      const suffixLength = Math.min(Math.max(0, Math.floor(keepEnd)), value.length);
      let start = 0;
      let end = value.length;
      let result = "…";
      while (start <= end) {
        const count = Math.floor((start + end) / 2);
        const suffix = Math.min(suffixLength, count);
        const candidate = `${value.slice(0, count - suffix)}…${suffix ? value.slice(-suffix) : ""}`;
        if (fits(candidate)) {
          result = candidate;
          start = count + 1;
        } else end = count - 1;
      }
      setVisible(result);
    };
    const observer = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
    observer.observe(node);
    if (document.fonts && document.fonts.status !== "loaded")
      document.fonts.ready
        .then(() => {
          const width = fitted;
          fitted = -1;
          if (width >= 0) fit(width);
        })
        .catch(() => undefined);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, [value, keepEnd]);
  return (
    <span
      ref={host}
      data-slot="middle-truncate"
      className={cn(styles.truncate, mono && styles.mono, className)}
      title={title === false ? undefined : (title ?? value)}
      onCopy={(event) => {
        onCopy?.(event);
        if (!event.defaultPrevented) {
          event.clipboardData.setData("text/plain", value);
          event.preventDefault();
        }
      }}
      {...props}
    >
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{visible}</span>
    </span>
  );
}
MiddleTruncate.displayName = "MiddleTruncate";
