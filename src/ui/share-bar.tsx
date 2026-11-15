import * as React from "react";

import { cn } from "../lib/utils";

import styles from "./share-bar.module.css";

export type ShareBarItem = {
  id: string;
  label: string;
  value: number;
  /** Any CSS colour. Defaults to the chart series in order, the same chart-1 to chart-6 the Chart uses. */
  color?: string;
};

export type ShareBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: readonly ShareBarItem[];
  /** Names the bar for assistive technology, which hears it with every share, as in "Auth methods: Universal Auth 62%, ...". */
  label: string;
  /** What the shares are a part of. Defaults to the sum of the values; a larger total leaves the rest of the track empty. */
  total?: number;
  format?: (value: number) => string;
  legend?: boolean;
  /** Segments shown before the smallest items fold into one Other segment. Defaults to 6, the number of chart series, so no two segments share a colour. */
  max?: number;
  otherLabel?: string;
  empty?: React.ReactNode;
};

const series = [
  "var(--cipher-chart-1)",
  "var(--cipher-chart-2)",
  "var(--cipher-chart-3)",
  "var(--cipher-chart-4)",
  "var(--cipher-chart-5)",
  "var(--cipher-chart-6)"
];

const defaultFormat = (value: number) => value.toLocaleString();

const percent = (value: number, total: number) => {
  if (value <= 0 || total <= 0) return "0%";
  const share = (value / total) * 100;
  if (share < 1) return "<1%";
  if (share > 99 && value < total) return ">99%";
  return `${Math.round(share)}%`;
};

export function ShareBar({
  items,
  label,
  total,
  format = defaultFormat,
  legend = true,
  max = series.length,
  otherLabel = "Other",
  empty = "No data",
  className,
  ...props
}: ShareBarProps) {
  const clean = items.map((item) => ({
    ...item,
    value: Number.isFinite(item.value) && item.value > 0 ? item.value : 0
  }));
  const sum = clean.reduce((acc, item) => acc + item.value, 0);
  const whole = typeof total === "number" && Number.isFinite(total) && total > sum ? total : sum;
  const limit = Math.max(2, Math.floor(max));
  const folded =
    clean.length > limit
      ? new Set(
          [...clean]
            .sort((a, b) => b.value - a.value)
            .slice(limit - 1)
            .map((item) => item.id)
        )
      : new Set<string>();
  const shown = clean.filter((item) => !folded.has(item.id));
  const rest = clean.filter((item) => folded.has(item.id));
  const rows = [
    ...shown.map((item, index) => ({
      ...item,
      color: item.color ?? series[index % series.length],
      other: false,
      title: undefined as string | undefined
    })),
    ...(rest.length
      ? [
          {
            id: "__other",
            label: `${otherLabel} (${rest.length})`,
            value: rest.reduce((acc, item) => acc + item.value, 0),
            color: undefined,
            other: true,
            title: rest.map((item) => `${item.label}: ${format(item.value)}`).join("\n")
          }
        ]
      : [])
  ];
  const summary =
    whole > 0
      ? `${label}: ${rows
          .filter((row) => row.value > 0)
          .map((row) => `${row.label} ${percent(row.value, whole)}`)
          .join(", ")}`
      : `${label}: ${typeof empty === "string" ? empty : "no data"}`;

  return (
    <div data-slot="share-bar" className={cn(styles.root, className)} {...props}>
      <div role="img" aria-label={summary} className={styles.bar}>
        {rows.map((row) =>
          row.value > 0 ? (
            <span
              key={row.id}
              className={styles.segment}
              data-other={row.other || undefined}
              style={{ flexGrow: row.value, background: row.color }}
            />
          ) : null
        )}
        {whole > sum && sum > 0 && (
          <span className={styles.remainder} style={{ flexGrow: whole - sum }} />
        )}
      </div>
      {legend &&
        (whole > 0 ? (
          <ul className={styles.legend}>
            {rows.map((row) => (
              <li key={row.id} className={styles.entry}>
                <span
                  className={styles.swatch}
                  data-other={row.other || undefined}
                  style={{ background: row.color }}
                />
                <span className={styles.name} title={row.title}>
                  {row.label}
                </span>
                <span className={styles.share}>{percent(row.value, whole)}</span>
                <span className={styles.count}>{format(row.value)}</span>
              </li>
            ))}
            <li className={cn(styles.entry, styles.total)}>
              <span />
              <span className={styles.name}>Total</span>
              <span />
              <span className={styles.count}>{format(whole)}</span>
            </li>
          </ul>
        ) : (
          <p className={styles.empty}>{empty}</p>
        ))}
    </div>
  );
}
ShareBar.displayName = "ShareBar";
