import * as React from "react";

import { cn } from "../lib/utils";

import styles from "./text.module.css";

let ruler: CanvasRenderingContext2D | null | undefined;

const transforms: Record<string, (text: string) => string> = {
  uppercase: (text) => text.toUpperCase(),
  lowercase: (text) => text.toLowerCase(),
  capitalize: (text) =>
    text.replace(
      /(^|\s)(\S)/g,
      (_, space: string, letter: string) => space + letter.toUpperCase(),
    ),
};

function measurerFor(node: HTMLElement) {
  if (ruler === undefined)
    ruler = document.createElement("canvas").getContext("2d");
  const context = ruler;
  if (!context) return null;
  const style = getComputedStyle(node);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.letterSpacing =
    style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
  context.wordSpacing =
    style.wordSpacing === "normal" ? "0px" : style.wordSpacing;
  context.fontKerning = style.fontKerning === "none" ? "none" : "normal";
  const transform = transforms[style.textTransform];
  return (text: string) => {
    const collapsed = text.replace(/[ \t\n\r\f]+/g, " ");
    return context.measureText(transform ? transform(collapsed) : collapsed)
      .width;
  };
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
      const measure = width ? measurerFor(node) : null;
      if (!measure) {
        setVisible(value);
        return;
      }
      const fits = (candidate: string) => measure(candidate) <= width;
      if (fits(value)) {
        setVisible(value);
        return;
      }
      const suffixLength = Math.min(
        Math.max(0, Math.floor(keepEnd)),
        value.length,
      );
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
    const observer = new ResizeObserver(([entry]) =>
      fit(entry.contentRect.width),
    );
    observer.observe(node);
    const refit = () => {
      const width = fitted;
      fitted = -1;
      if (width >= 0) fit(width);
    };
    document.fonts?.addEventListener("loadingdone", refit);
    return () => {
      alive = false;
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", refit);
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
