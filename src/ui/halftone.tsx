import * as React from "react";

import { useV4Scheme } from "../scope";
import { cn } from "../lib/utils";

import styles from "./halftone.module.css";

export type HalftoneAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type HalftoneProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
  anchor?: HalftoneAnchor;
  reach?: number;
  depth?: number;
  density?: number;
  intensity?: number;
  tone?: "hue" | "accent" | "ink";
};

const bayer = (size: number): number[][] => {
  if (size === 1) return [[0]];
  const half = bayer(size / 2);
  const span = half.length;
  return Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const value = 4 * half[y % span][x % span];
      if (y < span) return x < span ? value : value + 2;
      return x < span ? value + 3 : value + 1;
    })
  );
};
const thresholds = bayer(8).map((row) => row.map((value) => (value + 0.5) / 64));
const alphaSteps = 12;

const cellPaths = (
  width: number,
  height: number,
  { anchor, reach, depth, density, gamma, cell }: {
    anchor: HalftoneAnchor;
    reach: number;
    depth: number;
    density: number;
    gamma: number;
    cell: number;
  }
) => {
  const reachY = height * depth;
  const columns = Math.ceil(Math.min(width, reach) / cell);
  const rows = Math.ceil(Math.min(height, reachY) / cell);
  const fromRight = anchor.endsWith("right");
  const fromBottom = anchor.startsWith("bottom");
  const steps = new Map<number, string[]>();
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const distance = Math.hypot(((column + 0.5) * cell) / reach, ((row + 0.5) * cell) / reachY);
      const falloff = Math.max(0, 1 - distance);
      if (density * falloff ** gamma <= thresholds[row % 8][column % 8]) continue;
      const step = Math.round(falloff * alphaSteps);
      if (!step) continue;
      const x = fromRight ? width - (column + 1) * cell : column * cell;
      const y = fromBottom ? height - (row + 1) * cell : row * cell;
      const path = steps.get(step) ?? [];
      path.push(`M${x} ${y}h${cell}v${cell}h-${cell}z`);
      steps.set(step, path);
    }
  }
  return [...steps].map(([step, path]) => ({ opacity: step / alphaSteps, d: path.join("") }));
};

const readNumber = (element: Element, property: string, fallback: number) => {
  const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
  return Number.isFinite(value) ? value : fallback;
};

/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. */
export function Halftone({
  anchor = "top-right",
  reach = 216,
  depth = 1.5,
  density = 1,
  intensity = 1,
  tone = "hue",
  className,
  style,
  ref,
  ...props
}: HalftoneProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const scheme = useV4Scheme();
  const own = React.useRef<HTMLSpanElement>(null);
  const [box, setBox] = React.useState<{
    width: number;
    height: number;
    top: number;
    left: number;
    gamma: number;
    cell: number;
  }>();
  React.useImperativeHandle(ref, () => own.current as HTMLSpanElement);
  React.useLayoutEffect(() => {
    const element = own.current;
    const parent = element?.parentElement;
    if (!element || !parent) return undefined;
    const measure = () => {
      const parentStyle = getComputedStyle(parent);
      const next = {
        width: parent.clientWidth,
        height: parent.clientHeight,
        top: Number.parseFloat(parentStyle.paddingTop) || 0,
        left: Number.parseFloat(parentStyle.paddingLeft) || 0,
        gamma: readNumber(element, "--v4-halftone-gamma", 1),
        cell: readNumber(element, "--v4-size-halftone-cell", 8)
      };
      setBox((previous) =>
        previous &&
        (Object.keys(next) as (keyof typeof next)[]).every((key) => previous[key] === next[key])
          ? previous
          : next
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    return () => observer.disconnect();
  }, [scheme]);
  const paths = React.useMemo(
    () =>
      box && box.width && box.height
        ? cellPaths(box.width, box.height, { anchor, reach, depth, density, ...box })
        : [],
    [box, anchor, reach, depth, density]
  );
  return (
    <span
      ref={own}
      aria-hidden="true"
      data-slot="halftone"
      data-tone={tone}
      className={cn(styles.halftone, className)}
      style={{
        ...style,
        width: box?.width,
        height: box?.height,
        marginTop: box ? -box.top : undefined,
        marginLeft: box ? -box.left : undefined,
        ["--halftone-intensity" as string]: intensity
      }}
      {...props}
    >
      {box && (
        <svg width={box.width} height={box.height} shapeRendering="crispEdges" focusable="false">
          {paths.map((path) => (
            <path key={path.opacity} d={path.d} fillOpacity={path.opacity} />
          ))}
        </svg>
      )}
    </span>
  );
}
Halftone.displayName = "Halftone";
