import * as React from "react";

import type { CipherLinkProps } from "../lib/link";
import { cn } from "../lib/utils";
import { Card, CardContent, CardLink } from "./card";
import { Icon, type IconSource } from "./icon";
import { Media } from "./item";
import { Skeleton } from "./skeleton";
import { StatusText } from "./text";

import styles from "./stat-card.module.css";

const trendIcon = {
  up: "arrow-up",
  down: "arrow-down",
  flat: "minus"
} as const;
const trendTone = { up: "ok", down: "bad", flat: "neutral" } as const;

export type StatCardProps = Omit<
  React.ComponentProps<typeof Card>,
  "title" | "badges" | "description" | "hint" | "action" | "footer" | "footerPlacement" | "children"
> & {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: IconSource;
  /** Tone of the icon, for a metric that needs attention. */
  tone?: "ok" | "warn" | "bad" | "info";
  /** The change since the last period, such as "+12%". Its text carries the direction; the arrow is decoration. */
  delta?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  /** Defaults to ok for up, bad for down and neutral for flat; set it for a metric where up is bad. */
  deltaTone?: "ok" | "bad" | "neutral";
  /** A short line under the value: what the number counts, the comparison period, or a link. */
  note?: React.ReactNode;
  /** Makes the whole card a link, named by the label. */
  link?: CipherLinkProps["link"];
  loading?: boolean;
  /** Replaces the value with this message when the metric failed to load. */
  error?: React.ReactNode;
};

export function StatCard({
  label,
  value,
  icon,
  tone,
  delta,
  trend = "flat",
  deltaTone,
  note,
  link,
  loading = false,
  error,
  variant = "framed",
  className,
  ...props
}: StatCardProps) {
  const id = React.useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const failed = error !== undefined && error !== null && error !== false;
  return (
    <Card
      data-slot="stat-card"
      role="group"
      aria-labelledby={labelId}
      aria-busy={loading || undefined}
      variant={variant}
      className={cn(styles.statCard, className)}
      {...props}
    >
      <CardContent className={styles.body}>
        <div className={styles.head}>
          <span id={labelId} className={styles.label}>
            {link ? (
              <CardLink link={link} aria-describedby={valueId}>
                {label}
              </CardLink>
            ) : (
              label
            )}
          </span>
          {icon && <Media icon={icon} size="sm" tone={tone} aria-hidden />}
        </div>
        {loading ? (
          <Skeleton className={styles.valueSkeleton} />
        ) : failed ? (
          <StatusText tone="bad" icon="alert" className={styles.error}>
            {error}
          </StatusText>
        ) : (
          <div id={valueId} data-slot="stat-card-value" className={styles.value}>
            {value}
          </div>
        )}
        {!loading && !failed && (delta !== undefined || note !== undefined) && (
          <div className={styles.foot}>
            {delta !== undefined && (
              <span
                data-slot="stat-card-delta"
                data-tone={deltaTone ?? trendTone[trend]}
                className={styles.delta}
              >
                <Icon name={trendIcon[trend]} aria-hidden />
                {delta}
              </span>
            )}
            {note !== undefined && <span className={styles.note}>{note}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
