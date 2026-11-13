import * as React from "react";

import { useScheme } from "../scope";
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
  /** Warps the falloff and the dither thresholds with coherent noise, so each seed gets its own texture. The same seed always draws the same pattern. */
  seed?: string | number;
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
const hoverScale = 1.5;

const perlin = (seed: string | number) => {
  let state = [...String(seed)].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
    2166136261
  );
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const table = Array.from({ length: 256 }, (_, index) => index);
  for (let index = 255; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [table[index], table[swap]] = [table[swap], table[index]];
  }
  const hash = (x: number, y: number) => table[(table[x & 255] + y) & 255];
  const gradient = (corner: number, x: number, y: number) =>
    (corner & 1 ? x : -x) + (corner & 2 ? y : -y);
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  return (x: number, y: number) => {
    const cellX = Math.floor(x);
    const cellY = Math.floor(y);
    const dx = x - cellX;
    const dy = y - cellY;
    const u = fade(dx);
    const top =
      gradient(hash(cellX, cellY), dx, dy) * (1 - u) +
      gradient(hash(cellX + 1, cellY), dx - 1, dy) * u;
    const bottom =
      gradient(hash(cellX, cellY + 1), dx, dy - 1) * (1 - u) +
      gradient(hash(cellX + 1, cellY + 1), dx - 1, dy - 1) * u;
    return top + (bottom - top) * fade(dy);
  };
};

const cellPaths = (
  width: number,
  height: number,
  {
    anchor,
    reach,
    depth,
    density,
    gamma,
    cell,
    noise
  }: {
    anchor: HalftoneAnchor;
    reach: number;
    depth: number;
    density: number;
    gamma: number;
    cell: number;
    noise?: (x: number, y: number) => number;
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
      const warp = noise ? 0.3 * noise(column / 5, row / 5) : 0;
      const jitter = noise ? 0.25 * noise(column / 2 + 31.7, row / 2 + 17.3) : 0;
      const distance =
        Math.hypot(((column + 0.5) * cell) / reach, ((row + 0.5) * cell) / reachY) + warp;
      const falloff = Math.min(1, Math.max(0, 1 - distance));
      const threshold = Math.min(63.5 / 64, Math.max(0.5 / 64, thresholds[row % 8][column % 8] + jitter));
      if (density * falloff ** gamma <= threshold) continue;
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

/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card spreads it into larger cells and raises its strength. */
export function Halftone({
  anchor = "top-right",
  reach = 216,
  depth = 1.5,
  density = 1,
  intensity = 1,
  tone = "hue",
  seed,
  className,
  style,
  ref,
  ...props
}: HalftoneProps & { ref?: React.Ref<HTMLSpanElement> }) {
  const scheme = useScheme();
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
        gamma: readNumber(element, "--cipher-halftone-gamma", 1),
        cell: Math.max(1, readNumber(element, "--cipher-size-halftone-cell", 8))
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
  const layers = React.useMemo(() => {
    if (!box?.width || !box.height) return undefined;
    const noise = seed === undefined ? undefined : perlin(seed);
    const shared = { anchor, depth, gamma: box.gamma, noise };
    return {
      rest: cellPaths(box.width, box.height, { ...shared, reach, density, cell: box.cell }),
      hover: cellPaths(box.width, box.height, {
        ...shared,
        reach: reach * hoverScale,
        depth: depth * hoverScale,
        density: density * 1.25,
        cell: box.cell * hoverScale
      })
    };
  }, [box, anchor, reach, depth, density, seed]);
  const origin = box
    ? `${anchor.endsWith("right") ? box.width : 0}px ${anchor.startsWith("bottom") ? box.height : 0}px`
    : undefined;
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
      {box && layers && (
        <svg width={box.width} height={box.height} shapeRendering="crispEdges" focusable="false">
          {(["rest", "hover"] as const).map((layer) => (
            <g key={layer} className={styles[layer]} style={{ transformOrigin: origin }}>
              {layers[layer].map((path) => (
                <path key={path.opacity} d={path.d} fillOpacity={path.opacity} />
              ))}
            </g>
          ))}
        </svg>
      )}
    </span>
  );
}
Halftone.displayName = "Halftone";
