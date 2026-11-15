import * as React from "react";

import { cn } from "../lib/utils";
import { Tooltip, TooltipProvider } from "./tooltip";
import { worldMapCountries, worldMapFrame } from "./world-map-geometry";
import { equalEarth } from "./world-map-projection";

import styles from "./world-map.module.css";

export type WorldMapLocation = {
  /** Unique per location. Defaults to the label. */
  id?: string;
  /** What the tooltip and legend name the location, such as "Toronto, CA" or "Local network". */
  label: string;
  /** ISO 3166-1 alpha-2 code. Locations that share one add up to that country's tone. */
  country?: string;
  /** Without both coordinates the location has no marker and appears only in the legend. */
  lat?: number;
  lng?: number;
  count: number;
};

export type WorldMapProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  locations: WorldMapLocation[];
  /** Names the map for assistive technology, such as "Secret access locations". */
  label: string;
  /** markers sizes a square per location by count, regions tones each country by its total, both does both. */
  display?: "both" | "markers" | "regions";
  formatCount?: (count: number) => string;
  /** How many locations the legend lists before it sums the rest. */
  legendLimit?: number;
  /** Turns the legend off when the page already lists the locations. */
  legend?: boolean;
  /** Shown over the map when no location has a count. */
  empty?: React.ReactNode;
};

const steps = 4;
const markerMin = 7;
const markerMax = 20;
const defaultFormat = (count: number) =>
  `${count.toLocaleString("en-US")} ${count === 1 ? "access" : "accesses"}`;
const regionNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["en"], { type: "region", fallback: "code" })
    : null;
const regionName = (code: string) => {
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

/** Projects a longitude and latitude into the WorldMap viewBox. */
export function projectWorldMap(lng: number, lat: number): [number, number] {
  const [x, y] = equalEarth(lng, lat);
  return [worldMapFrame.x + x * worldMapFrame.scale, worldMapFrame.y - y * worldMapFrame.scale];
}

type Target = { key: string; name: string; count: number };

function WorldMap({
  locations,
  label,
  display = "both",
  formatCount = defaultFormat,
  legendLimit = 8,
  legend = true,
  empty = "No locations",
  className,
  ...props
}: WorldMapProps) {
  const counted = React.useMemo(
    () =>
      locations
        .filter((location) => location.count > 0)
        .map((location) => ({ ...location, key: location.id ?? location.label }))
        .sort((a, b) => b.count - a.count),
    [locations]
  );
  const total = counted.reduce((sum, location) => sum + location.count, 0);

  const markers = React.useMemo(() => {
    if (display === "regions") return [];
    const placed = counted.filter(
      (location) => Number.isFinite(location.lat) && Number.isFinite(location.lng)
    );
    const max = placed[0]?.count ?? 1;
    return placed.map((location) => {
      const [x, y] = projectWorldMap(location.lng!, location.lat!);
      const size = markerMin + Math.sqrt(location.count / max) * (markerMax - markerMin);
      return { ...location, name: location.label, x, y, size };
    });
  }, [counted, display]);

  const regions = React.useMemo(() => {
    const totals = new Map<string, number>();
    if (display !== "markers")
      counted.forEach((location) => {
        const code = location.country?.toUpperCase();
        if (code) totals.set(code, (totals.get(code) ?? 0) + location.count);
      });
    const max = Math.max(1, ...totals.values());
    return { totals, step: (count: number) => Math.max(1, Math.ceil((count / max) * steps)) };
  }, [counted, display]);

  const targets: Target[] = React.useMemo(
    () =>
      display === "regions"
        ? [...regions.totals]
            .filter(([code]) => worldMapCountries.some(([country]) => country === code))
            .sort((a, b) => b[1] - a[1])
            .map(([code, count]) => ({ key: code, name: regionName(code), count }))
        : markers,
    [display, markers, regions]
  );
  const [focused, setFocused] = React.useState(0);
  const active = Math.min(focused, Math.max(0, targets.length - 1));
  const elements = React.useRef(new Map<string, SVGElement>());

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = targets.length - 1;
    const next = {
      ArrowRight: Math.min(active + 1, last),
      ArrowDown: Math.min(active + 1, last),
      ArrowLeft: Math.max(active - 1, 0),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last
    }[event.key];
    if (next === undefined || last < 0) return;
    event.preventDefault();
    setFocused(next);
    elements.current.get(targets[next].key)?.focus();
  };
  const targetProps = (target: Target, index: number) => ({
    ref: (element: SVGElement | null) => {
      if (element) elements.current.set(target.key, element);
      else elements.current.delete(target.key);
    },
    role: "img",
    "aria-label": `${target.name}: ${formatCount(target.count)}`,
    tabIndex: index === active ? 0 : -1,
    onFocus: () => setFocused(index)
  });
  const tip = (target: Target) => (
    <span className={styles.tip}>
      <span className={styles.tipName}>{target.name}</span>{" "}
      <span className={styles.tipCount}>{formatCount(target.count)}</span>
    </span>
  );

  const listed = counted.slice(0, legendLimit);
  const rest = counted.slice(legendLimit).reduce((sum, location) => sum + location.count, 0);
  const summary = counted.length
    ? `${counted.length} ${counted.length === 1 ? "location" : "locations"}, ${formatCount(total)}`
    : String(typeof empty === "string" ? empty : "No locations");

  return (
    <TooltipProvider>
      <div data-slot="world-map" className={cn(styles.root, className)} {...props}>
        <div className={styles.canvas} data-empty={counted.length ? undefined : ""}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${worldMapFrame.width} ${worldMapFrame.height}`}
            role="group"
            aria-label={label}
            onKeyDown={onKeyDown}
          >
            <g className={styles.land} aria-hidden={display === "regions" ? undefined : true}>
              {worldMapCountries.map(([code, d], index) => {
                const count = code ? regions.totals.get(code) : undefined;
                if (!count) return <path key={code || index} d={d} />;
                const target = { key: code, name: regionName(code), count };
                const region = (
                  <path
                    key={code}
                    d={d}
                    className={styles.region}
                    data-step={regions.step(count)}
                    {...(display === "regions"
                      ? targetProps(
                          target,
                          targets.findIndex((item) => item.key === code)
                        )
                      : {})}
                  />
                );
                return (
                  <Tooltip key={code} content={tip(target)}>
                    {region}
                  </Tooltip>
                );
              })}
            </g>
            {markers.length > 0 && (
              <g className={styles.markers}>
                {markers.map((marker, index) => (
                  <Tooltip key={marker.key} content={tip(marker)}>
                    <rect
                      {...targetProps(marker, index)}
                      className={styles.marker}
                      x={marker.x - marker.size / 2}
                      y={marker.y - marker.size / 2}
                      width={marker.size}
                      height={marker.size}
                    />
                  </Tooltip>
                ))}
              </g>
            )}
          </svg>
          {!counted.length && (
            <div className={styles.empty}>
              <span>{empty}</span>
            </div>
          )}
        </div>
        {legend && counted.length > 0 && (
          <div className={styles.legend}>
            <ul className={styles.list}>
              {listed.map((location) => {
                const placed =
                  display !== "regions" &&
                  Number.isFinite(location.lat) &&
                  Number.isFinite(location.lng);
                return (
                  <li key={location.key} className={styles.item}>
                    <span
                      className={styles.swatch}
                      data-kind={placed ? "marker" : "none"}
                      aria-hidden
                    />
                    <span className={styles.name}>{location.label}</span>
                    <span className={styles.count}>{formatCount(location.count)}</span>
                  </li>
                );
              })}
              {rest > 0 && (
                <li className={styles.item}>
                  <span className={styles.name}>{counted.length - legendLimit} more</span>
                  <span className={styles.count}>{formatCount(rest)}</span>
                </li>
              )}
            </ul>
            {display !== "markers" && regions.totals.size > 0 && (
              <div className={styles.scale} aria-hidden>
                <span>Fewer</span>
                {Array.from({ length: steps }, (_, step) => (
                  <span key={step} className={styles.step} data-step={step + 1} />
                ))}
                <span>More</span>
              </div>
            )}
          </div>
        )}
        <p className="sr-only" aria-live="polite">
          {summary}
        </p>
      </div>
    </TooltipProvider>
  );
}

export { WorldMap };
