import * as React from "react";

import { useScheme } from "../scope";
import { cn } from "../lib/utils";

import styles from "./halftone.module.css";

export type HalftoneAnchor =
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type HalftoneProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  anchor?: HalftoneAnchor;
  reach?: number;
  depth?: number;
  density?: number;
  intensity?: number;
  tone?: "hue" | "accent" | "ink";
  /** Warps the falloff and the dither thresholds with coherent noise, so each seed gets its own texture. The same seed always draws the same pattern. */
  seed?: string | number;
  /** Where the wash may reach. header keeps a top-anchored wash inside the card's header, clear of its body and footer. */
  bounds?: "surface" | "header";
  /** Caps the corner at this many halftone cells across and down, at rest and on hover. */
  size?: number;
  /** hover draws nothing at rest and grows the corner out while the card is hovered or focused. */
  reveal?: "always" | "hover";
  /** Cells shimmer in a slow wave travelling out from the anchor. Off under reduced motion. */
  ambient?: boolean;
  /** An icon traced in halftone cells while the card is hovered: the cells under its shape turn the hue's icon color, and nothing paints outside the pattern. It sits two cells in from the anchor's side, at the far edge of the bounded wash, with its last quarter past that edge. */
  figure?: React.ReactNode;
  /** Edge of the figure in pixels. */
  figureSize?: number;
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
    }),
  );
};
const thresholds = bayer(8).map((row) =>
  row.map((value) => (value + 0.5) / 64),
);
const alphaSteps = 12;
const hoverScale = 1.5;
const phases = 6;
const drawDuration = 480;
const figureDensity = 24;
const figureStroke = 1.25;
const drawStagger = 70;
const drawTime = (progress: number) => {
  let low = 0;
  let high = 1;
  for (let index = 0; index < 24; index += 1) {
    const t = (low + high) / 2;
    if (3 * (1 - t) * t * t + t * t * t < progress) low = t;
    else high = t;
  }
  return 0.6 * (1 - low) * (1 - low) * low + low * low * low;
};
const overshoot = 1.35;

const perlin = (seed: string | number) => {
  let state = [...String(seed)].reduce(
    (hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619),
    2166136261,
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
    limit,
    noise,
    figure,
    order,
  }: {
    anchor: HalftoneAnchor;
    reach: number;
    depth: number;
    density: number;
    gamma: number;
    cell: number;
    limit: { width: number; height: number };
    noise?: (x: number, y: number) => number;
    figure?: (x: number, y: number) => boolean;
    order?: (x: number, y: number) => number;
  },
) => {
  const reachX = Math.min(reach, limit.width);
  const reachY = Math.min(height * depth, limit.height);
  const columns = Math.ceil(Math.min(width, reachX) / cell);
  const rows = Math.ceil(Math.min(height, reachY) / cell);
  const fromRight = anchor.endsWith("right");
  const fromBottom = anchor.startsWith("bottom");
  const steps = new Map<
    string,
    { opacity: number; phase: number; delay: number; d: string[] }
  >();
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const warp = noise ? 0.3 * noise(column / 5, row / 5) : 0;
      const jitter = noise
        ? 0.25 * noise(column / 2 + 31.7, row / 2 + 17.3)
        : 0;
      const distance =
        Math.hypot(
          ((column + 0.5) * cell) / reachX,
          ((row + 0.5) * cell) / reachY,
        ) + warp;
      const falloff = Math.min(1, Math.max(0, 1 - distance));
      const x = fromRight ? width - (column + 1) * cell : column * cell;
      const y = fromBottom ? height - (row + 1) * cell : row * cell;
      const threshold = Math.min(
        63.5 / 64,
        Math.max(0.5 / 64, thresholds[row % 8][column % 8] + jitter),
      );
      if (figure && !figure(x, y)) continue;
      if (
        (figure ? figureDensity : 1) * density * falloff ** gamma <=
        threshold
      )
        continue;
      const step = figure ? alphaSteps : Math.round(falloff * alphaSteps);
      if (!step) continue;
      const wave =
        (column + row) / 3 +
        (noise ? 2 * noise(column / 4 + 7.1, row / 4 + 3.9) : 0);
      const phase = ((Math.floor(wave) % phases) + phases) % phases;
      const delay = order ? order(x, y) : 0;
      const key = `${step}-${phase}-${delay}`;
      const path = steps.get(key) ?? {
        opacity: step / alphaSteps,
        phase,
        delay,
        d: [],
      };
      path.d.push(`M${x} ${y}h${cell}v${cell}h-${cell}z`);
      steps.set(key, path);
    }
  }
  return [...steps].map(([key, path]) => ({
    ...path,
    key,
    d: path.d.join(""),
  }));
};

const readNumber = (element: Element, property: string, fallback: number) => {
  const value = Number.parseFloat(
    getComputedStyle(element).getPropertyValue(property),
  );
  return Number.isFinite(value) ? value : fallback;
};

/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card grows the wash outward from its anchor at the same cell size and raises its strength. */
export function Halftone({
  anchor = "top-right",
  reach = 216,
  depth = 1.5,
  density = 1,
  intensity = 1,
  tone = "hue",
  seed,
  bounds = "surface",
  size,
  reveal = "always",
  ambient = false,
  figure,
  figureSize = 112,
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
    limitWidth: number;
    limitHeight: number;
  }>();
  const holder = React.useRef<SVGGElement>(null);
  const traced = React.useRef<string>(undefined);
  const [shape, setShape] = React.useState<{
    size: number;
    alpha: Uint8ClampedArray;
    trace: { x: number; y: number; at: number }[];
  }>();
  React.useImperativeHandle(ref, () => own.current as HTMLSpanElement);
  React.useEffect(() => {
    const icon = holder.current?.firstElementChild;
    const source = icon
      ? `${figureSize}:${new XMLSerializer().serializeToString(icon)}`
      : undefined;
    if (source === traced.current) return;
    traced.current = source;
    if (!icon || !source) {
      setShape(undefined);
      return;
    }
    const copy = icon.cloneNode(true) as SVGElement;
    copy.setAttribute("width", String(figureSize));
    copy.setAttribute("height", String(figureSize));
    copy.removeAttribute("style");
    const viewBox = (icon as SVGSVGElement).viewBox?.baseVal;
    const scale = viewBox?.width ? figureSize / viewBox.width : 1;
    const cellSize = own.current
      ? Math.max(1, readNumber(own.current, "--cipher-size-halftone-cell", 8))
      : 8;
    copy.setAttribute(
      "stroke-width",
      String((figureStroke * cellSize) / scale),
    );
    const trace = [...icon.children].flatMap((child, index) => {
      if (!(child instanceof SVGGeometryElement)) return [];
      const length = child.getTotalLength();
      const count = Math.max(2, Math.ceil((length * scale) / 2));
      const start = drawStagger * Math.min(index, 3);
      return Array.from({ length: count + 1 }, (_, step) => {
        const point = child.getPointAtLength((length * step) / count);
        return {
          x: point.x * scale,
          y: point.y * scale,
          at: start + drawDuration * drawTime(step / count),
        };
      });
    });
    const image = new Image();
    image.onload = () => {
      if (traced.current !== source) return;
      const canvas = document.createElement("canvas");
      canvas.width = figureSize;
      canvas.height = figureSize;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, figureSize, figureSize);
      const pixels = context.getImageData(0, 0, figureSize, figureSize).data;
      const alpha = new Uint8ClampedArray(figureSize * figureSize);
      for (let index = 0; index < alpha.length; index += 1) {
        alpha[index] = pixels[index * 4 + 3];
      }
      setShape({ size: figureSize, alpha, trace });
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(copy))}`;
  });
  React.useLayoutEffect(() => {
    const element = own.current;
    const parent = element?.parentElement;
    if (!element || !parent) return undefined;
    const header =
      bounds === "header" && anchor.startsWith("top")
        ? parent.querySelector<HTMLElement>(
            ':scope > [data-slot="card-header"], :scope > [data-slot="card-inset"] > [data-slot="card-header"]',
          )
        : null;
    const measure = () => {
      const parentStyle = getComputedStyle(parent);
      const cell = Math.max(
        1,
        readNumber(element, "--cipher-size-halftone-cell", 8),
      );
      const cap = size ? size * cell : Infinity;
      const headerBottom = header
        ? header.getBoundingClientRect().bottom -
          parent.getBoundingClientRect().top -
          parent.clientTop
        : Infinity;
      const next = {
        width: parent.clientWidth,
        height: parent.clientHeight,
        top: Number.parseFloat(parentStyle.paddingTop) || 0,
        left: Number.parseFloat(parentStyle.paddingLeft) || 0,
        gamma: readNumber(element, "--cipher-halftone-gamma", 1),
        cell,
        limitWidth: Math.min(parent.clientWidth, cap),
        limitHeight: Math.round(
          Math.min(parent.clientHeight, cap, headerBottom),
        ),
      };
      setBox((previous) =>
        previous &&
        (Object.keys(next) as (keyof typeof next)[]).every(
          (key) => previous[key] === next[key],
        )
          ? previous
          : next,
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(parent);
    if (header) observer.observe(header);
    return () => observer.disconnect();
  }, [scheme, bounds, size, anchor]);
  const layers = React.useMemo(() => {
    if (!box?.width || !box.height) return undefined;
    const noise = seed === undefined ? undefined : perlin(seed);
    const limit = { width: box.limitWidth, height: box.limitHeight };
    const shared = { anchor, depth, gamma: box.gamma, limit, noise };
    const fromRight = anchor.endsWith("right");
    const figureLeft = shape
      ? fromRight
        ? box.width - 2 * box.cell - shape.size
        : 2 * box.cell
      : 0;
    const figureTop = shape
      ? anchor.startsWith("top")
        ? box.limitHeight - 0.75 * shape.size
        : box.height - box.limitHeight - 0.25 * shape.size
      : 0;
    const covered = (x: number, y: number) => {
      if (!shape) return false;
      let sum = 0;
      for (let row = 0; row < box.cell; row += 1) {
        for (let column = 0; column < box.cell; column += 1) {
          const px = Math.round(x + column - figureLeft);
          const py = Math.round(y + row - figureTop);
          if (px < 0 || py < 0 || px >= shape.size || py >= shape.size)
            continue;
          sum += shape.alpha[py * shape.size + px];
        }
      }
      return sum / (box.cell * box.cell * 255) > 0.4;
    };
    const order = (x: number, y: number) => {
      if (!shape) return 0;
      const centerX = x + box.cell / 2 - figureLeft;
      const centerY = y + box.cell / 2 - figureTop;
      let nearest = Infinity;
      let first = Infinity;
      let fallback = 0;
      for (const point of shape.trace) {
        const distance = Math.hypot(point.x - centerX, point.y - centerY);
        if (distance <= box.cell) first = Math.min(first, point.at);
        if (distance < nearest) {
          nearest = distance;
          fallback = point.at;
        }
      }
      return Math.round((first === Infinity ? fallback : first) / 40) * 40;
    };
    const grown = {
      ...shared,
      reach: reach * hoverScale,
      depth: depth * hoverScale,
      density: density * 1.25,
      cell: box.cell,
    };
    return {
      figure: shape
        ? cellPaths(box.width, box.height, {
            ...grown,
            figure: covered,
            order,
          })
        : [],
      rest: cellPaths(box.width, box.height, {
        ...shared,
        reach,
        density,
        cell: box.cell,
      }),
      hover: cellPaths(box.width, box.height, grown),
    };
  }, [box, anchor, reach, depth, density, seed, shape]);
  const extent = (scale: number) =>
    box && {
      x: Math.min(reach * scale, box.limitWidth) * overshoot + box.cell,
      y:
        Math.min(box.height * depth * scale, box.limitHeight) * overshoot +
        box.cell,
    };
  const rest = reveal === "hover" ? { x: 0, y: 0 } : extent(1);
  const grown = extent(hoverScale);
  return (
    <span
      ref={own}
      aria-hidden="true"
      data-slot="halftone"
      data-tone={tone}
      data-reveal={reveal === "hover" ? "hover" : undefined}
      className={cn(styles.halftone, className)}
      style={{
        ...style,
        width: box?.width,
        height: box?.height,
        marginTop: box ? -box.top : undefined,
        marginLeft: box ? -box.left : undefined,
        ["--halftone-intensity" as string]: intensity,
        ...(box &&
          rest &&
          grown && {
            ["--halftone-at" as string]: `${anchor.endsWith("right") ? box.width : 0}px ${anchor.startsWith("bottom") ? box.height : 0}px`,
            ["--halftone-rest" as string]: `${rest.x}px ${rest.y}px`,
            ["--halftone-grown" as string]: `${grown.x}px ${grown.y}px`,
          }),
      }}
      {...props}
    >
      {box &&
        layers &&
        (["rest", "hover"] as const).map((layer) => (
          <svg
            key={layer}
            width={box.width}
            height={box.height}
            shapeRendering="crispEdges"
            focusable="false"
            className={styles[layer]}
          >
            {layers[layer].map((path) => (
              <path
                key={path.key}
                d={path.d}
                fillOpacity={path.opacity}
                className={ambient ? styles.ambient : undefined}
                style={
                  ambient
                    ? {
                        animationDelay: `calc(var(--halftone-wave) * ${-path.phase / phases})`,
                      }
                    : undefined
                }
              />
            ))}
            {layer === "hover" &&
              layers.figure.map((path) => (
                <g
                  key={path.key}
                  className={styles.figure}
                  style={{ ["--figure-delay" as string]: `${path.delay}ms` }}
                >
                  <path
                    d={path.d}
                    fillOpacity={path.opacity}
                    className={ambient ? styles.ambient : undefined}
                    style={
                      ambient
                        ? {
                            animationDelay: `calc(var(--halftone-wave) * ${-path.phase / phases})`,
                          }
                        : undefined
                    }
                  />
                </g>
              ))}
          </svg>
        ))}
      {figure && (
        <svg width={0} height={0} className={styles.holder}>
          <g ref={holder}>{figure}</g>
        </svg>
      )}
    </span>
  );
}
Halftone.displayName = "Halftone";
