import { useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle
} from "@infisical/cipher/ui/card";
import { Icon, type IconName } from "@infisical/cipher/ui/icon";
import { StatCard, type StatCardProps } from "@infisical/cipher/ui/stat-card";
import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

type Metric = Pick<
  StatCardProps,
  "label" | "value" | "delta" | "trend" | "deltaTone" | "note" | "tone"
> & { icon?: IconName; href?: string };

const dashboard: Metric[] = [
  {
    label: "Total accounts",
    value: "1,284",
    icon: "building",
    href: "#/components/stat-card",
    delta: "+4.2%",
    trend: "up",
    note: "vs last month"
  },
  {
    label: "Total licenses",
    value: "3,902",
    icon: "key",
    href: "#/components/stat-card",
    delta: "+118",
    trend: "up",
    note: "vs last month"
  },
  {
    label: "Suspended",
    value: "7",
    icon: "lock",
    tone: "bad",
    href: "#/components/stat-card",
    delta: "+2",
    trend: "up",
    deltaTone: "bad",
    note: "Payment failed, entitlements paused"
  }
];

const trials: Metric[] = [
  { label: "Active trials", value: "42" },
  { label: "Converting by Nov 30", value: "$84,500" },
  { label: "ARR on conversion", value: "$1,240,000", delta: "-3%", trend: "down" }
];

const trendIcons = { up: "arrow-up", down: "arrow-down", flat: "minus" } as const;

function Band({ label, value, icon, href, delta, trend = "flat", deltaTone, note }: Metric) {
  const tone = deltaTone ?? { up: "ok", down: "bad", flat: "neutral" }[trend];
  const color = tone === "ok" ? "text-(--cipher-ok)" : tone === "bad" ? "text-(--cipher-bad)" : "";
  return (
    <Card variant="framed" size="sm">
      <CardHeader>
        <CardTitle>{href ? <CardLink link={{ href }}>{label}</CardLink> : label}</CardTitle>
        {icon && (
          <CardAction>
            <Icon name={icon} aria-hidden />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <div className="font-(family-name:--cipher-type-display-font-family) text-(length:--cipher-type-display-font-size) leading-(--cipher-type-display-line-height) font-(--cipher-type-display-font-weight) tabular-nums">
          {value}
        </div>
      </CardContent>
      {(delta !== undefined || note !== undefined) && (
        <CardFooter placement="frame">
          <span className="flex flex-wrap items-center gap-2">
            {delta !== undefined && (
              <span className={`inline-flex items-center gap-0.5 ${color}`}>
                <Icon name={trendIcons[trend]} aria-hidden />
                {delta}
              </span>
            )}
            {note}
          </span>
        </CardFooter>
      )}
    </Card>
  );
}

export default function Example() {
  const [look, setLook] = useState("stacked");
  const render = (metric: Metric, size?: "sm") =>
    look === "band" ? (
      <Band key={String(metric.label)} {...metric} />
    ) : (
      <StatCard
        key={String(metric.label)}
        {...metric}
        size={size}
        link={metric.href ? { href: metric.href } : undefined}
      />
    );
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <ToggleGroup
        type="single"
        value={look}
        onValueChange={(next) => next && setLook(next)}
        aria-label="Stat card layout"
      >
        <ToggleGroupItem value="stacked">Stacked (recommended)</ToggleGroupItem>
        <ToggleGroupItem value="band">Frame bands (alternative)</ToggleGroupItem>
      </ToggleGroup>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {dashboard.map((m) => render(m))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"icon, link, delta and note: each card opens the list behind its count"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {trials.map((m) => render(m, "sm"))}
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"small, label and value only"}
        </figcaption>
      </figure>
    </div>
  );
}
