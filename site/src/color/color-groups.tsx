import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import { hueScope } from "@infisical/cipher/lib/hue";
import { Alert } from "@infisical/cipher/ui/alert";
import { Badge } from "@infisical/cipher/ui/badge";
import { Banner } from "@infisical/cipher/ui/alert";
import { Button } from "@infisical/cipher/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@infisical/cipher/ui/card";
import * as UI from "@infisical/cipher/ui/chart";
import { Field } from "@infisical/cipher/ui/field";
import { Icon } from "@infisical/cipher/ui/icon";
import { Input } from "@infisical/cipher/ui/input";
import { Slider } from "@infisical/cipher/ui/slider";
import { Switch } from "@infisical/cipher/ui/switch";
import { Tabs } from "@infisical/cipher/ui/tabs";
import { ToastStack } from "@infisical/cipher/ui/toast-stack";

export type Composition = { title: string; tokens: string[]; Preview: () => React.ReactNode };

export type ColorGroup = {
  id: string;
  title: string;
  usage: string;
  sections: { title?: string; tokens: string[] }[];
  compositions: Composition[];
};

function CardOnPage() {
  return (
    <div className="bg-(--cipher-inset) p-6">
      <Card variant="framed" title="Posture" footer="Updated today" footerPlacement="frame">
        412 secrets across 3 environments. 5 rotations are due this week.
      </Card>
    </div>
  );
}

function TextLadder() {
  return (
    <Card variant="plain">
      <CardHeader>
        <CardTitle>Environment defaults</CardTitle>
        <CardDescription>Inherited by new connections.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span className="text-(--cipher-text2)">The default environment is staging.</span>
        <span className="text-xs text-(--cipher-faint)">Last edited 3 days ago</span>
        <span className="flex items-center gap-3">
          <Badge tone="solid">Inherited</Badge>
          <Button variant="link" asChild>
            <a href="#/color">View policy</a>
          </Button>
        </span>
      </CardContent>
    </Card>
  );
}

function FieldStates() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
      <Field label="At rest">
        <Input defaultValue="payments-api" />
      </Field>
      <Field label="Focused">
        <Input defaultValue="payments-api" aria-expanded="true" />
      </Field>
      <Field label="Invalid" error="Use letters, numbers and hyphens.">
        <Input invalid defaultValue="payments /" />
      </Field>
    </div>
  );
}

function AccentSet() {
  return (
    <div className="flex flex-col gap-4">
      <Banner>Production is locked for the release window.</Banner>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="accent">Deploy</Button>
        <Badge tone="accent">New</Badge>
      </div>
    </div>
  );
}

function ControlSet() {
  const [audit, setAudit] = useState(true);
  const [rotation, setRotation] = useState(false);
  const [days, setDays] = useState([30]);
  return (
    <div className="flex flex-col gap-5">
      <Tabs
        label="Sections"
        tabs={[
          { value: "secrets", label: "Secrets" },
          { value: "access", label: "Access" },
          { value: "audit", label: "Audit log" }
        ]}
      />
      <div className="flex flex-wrap items-center gap-6">
        <Switch label="Audit events" checked={audit} onChange={setAudit} />
        <Switch label="Rotation" checked={rotation} onChange={setRotation} />
      </div>
      <Slider value={days} onValueChange={setDays} min={1} max={90} aria-label="Retention in days" />
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline">Export</Button>
        <Button variant="ghost">Cancel</Button>
        <Input disabled defaultValue="Inherited from policy" width="md" />
      </div>
    </div>
  );
}

function PrimaryButton() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="accent">Create secret</Button>
      <Button variant="accent" icon="plus">
        Add environment
      </Button>
    </div>
  );
}

function StatusBadges() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge tone="ok" dot>
        Connected
      </Badge>
      <Badge tone="warn" dot>
        Expires in 7 days
      </Badge>
      <Badge tone="bad" dot>
        Unavailable
      </Badge>
      <Badge tone="info" dot>
        Syncing
      </Badge>
    </div>
  );
}

function StatusAlerts() {
  return (
    <div className="flex flex-col gap-3">
      <Alert tone="warn" title="Rotation overdue">
        Two credentials passed their 30 day rotation.
      </Alert>
      <Alert tone="bad" title="Sync failed">
        The provider rejected the access token.
      </Alert>
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive">Delete project</Button>
      </div>
    </div>
  );
}

const toasts = [
  { id: "saved", title: "Secret saved", description: "STRIPE_KEY in production.", tone: "ok" as const },
  { id: "failed", title: "Sync failed", description: "The provider rejected the token.", tone: "bad" as const }
];

function Toasts() {
  return <ToastStack inline items={toasts} />;
}

export const sampleHues = [113.8, 56, 172, 305, 18, 152, 250];

function HueCards() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3">
      {sampleHues.slice(0, 4).map((hue, index) => (
        <div key={hue} {...hueScope(hue, index % 2 ? "pop" : "subtle")}>
          <Card variant="framed" title={"Hue " + hue}>
            <span className="flex w-full items-center gap-2">
              <span className="inline-grid size-6 place-items-center bg-(--cipher-hue-soft) text-(--cipher-hue-icon)">
                <Icon name="key" size={14} />
              </span>
              <span className="h-2 flex-1 bg-(--cipher-hue-fill)" />
            </span>
          </Card>
        </div>
      ))}
    </div>
  );
}

const chartData = [24, 19, 15, 12, 9, 6].map((count, index) => ({
  series: "chart-" + (index + 1),
  count,
  color: UI.chartSeries[index]
}));

function ChartBars() {
  return (
    <UI.ChartContainer
      className="aspect-auto h-44"
      config={{ count: { label: "Certificates", color: "var(--chart-1)" } }}
    >
      <BarChart accessibilityLayer data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid vertical={false} stroke="var(--cipher-line)" />
        <XAxis dataKey="series" tickLine={false} axisLine={false} />
        <Bar isAnimationActive={false} dataKey="count" maxBarSize={40}>
          {chartData.map((entry) => (
            <Cell key={entry.series} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </UI.ChartContainer>
  );
}

export const colorGroups: ColorGroup[] = [
  {
    id: "surfaces",
    title: "Surfaces and paper",
    usage:
      "Grounds that content sits on. Pick by elevation: inset for the page, surface for cards and inputs, pop for anything floating, paper and tint for quiet bands.",
    sections: [
      { title: "Page and panels", tokens: ["inset", "surface", "pop", "frame", "frame-soft"] },
      { title: "Bands and rows", tokens: ["paper", "tint", "select", "row-done", "row-done-card", "row-done-divided"] },
      { title: "Sidebar", tokens: ["sidebar", "sidebar-current", "sidebar-hover"] },
      { title: "Overlay", tokens: ["scrim"] }
    ],
    compositions: [
      { title: "Framed card on the page", tokens: ["inset", "tint", "surface", "line-soft", "ink", "muted"], Preview: CardOnPage }
    ]
  },
  {
    id: "text",
    title: "Text",
    usage:
      "Ink for anything people must read, text2 for body copy, muted for secondary labels, faint only for metadata. On a dark fill, use the matching on- token.",
    sections: [
      { title: "Reading ladder", tokens: ["ink", "text2", "muted", "faint"] },
      { title: "On fills", tokens: ["on-ink", "on-accent", "on-bad"] },
      { title: "Roles", tokens: ["link", "mix-ink", "tab-label", "selected-ink"] }
    ],
    compositions: [
      { title: "Text hierarchy in a card", tokens: ["ink", "muted", "text2", "faint", "on-ink", "link"], Preview: TextLadder }
    ]
  },
  {
    id: "lines",
    title: "Lines and borders",
    usage:
      "line-soft separates content on a surface, line draws a structural rule, control outlines an input. Focus and errors change the border, never the fill.",
    sections: [
      { title: "Rules", tokens: ["line-soft", "line", "pop-line", "crumb-divider"] },
      { title: "Control borders", tokens: ["control", "action-outline-border", "choice-selected-border", "selected-border"] },
      { title: "Focus", tokens: ["focus-ring", "control-invalid-border", "focus-ring-bad"] }
    ],
    compositions: [
      {
        title: "Fields at rest, focused and invalid",
        tokens: ["control", "ink", "focus-ring", "control-invalid-border", "focus-ring-bad", "bad"],
        Preview: FieldStates
      }
    ]
  },
  {
    id: "accent",
    title: "Accent",
    usage:
      "Infisical yellow, the same in both themes. One accent per view: the primary action, a new badge, a highlighted callout. Text on it is always on-accent.",
    sections: [
      { title: "Accent", tokens: ["accent", "accent-2", "on-accent", "accent-fg", "mark"] },
      { title: "Callouts", tokens: ["accent-wash", "accent-line"] }
    ],
    compositions: [
      { title: "Callout and primary action", tokens: ["accent-wash", "accent-line", "accent", "on-accent", "ink"], Preview: AccentSet }
    ]
  },
  {
    id: "controls",
    title: "Controls and states",
    usage:
      "Paint for interaction. Hover and press are translucent mix-ink layers, so they work on any ground. Selection stays neutral; only the on switch and slider use the accent in dark.",
    sections: [
      { title: "Hover and press", tokens: ["hover", "press", "action-ghost-hover", "action-outline-hover", "scroll-thumb", "scroll-thumb-hover"] },
      { title: "Control fills", tokens: ["control-surface", "control-surface-hover", "control-disabled-surface", "action-outline-surface", "switch-off-surface"] },
      { title: "Selection", tokens: ["selected-surface", "choice-selected-surface"] },
      { title: "Switch and slider", tokens: ["sw-on", "sw-knob-on", "switch-thumb", "switch-thumb-line", "slider-range", "slider-track"] }
    ],
    compositions: [
      {
        title: "Tabs, switches, slider and secondary actions",
        tokens: ["tab-label", "sw-on", "sw-knob-on", "switch-off-surface", "switch-thumb", "slider-range", "slider-track", "action-outline-border", "control-disabled-surface"],
        Preview: ControlSet
      }
    ]
  },
  {
    id: "button",
    title: "Primary button",
    usage:
      "The accent Button's material: a face gradient, a bloom and a glow, all mixed from accent. Only the accent Button uses these; never paint anything else with them.",
    sections: [
      { title: "Rest", tokens: ["button-face-start", "button-face-end", "button-bloom", "button-glow"] },
      { title: "Hover", tokens: ["button-hover-start", "button-hover-end", "button-hover-bloom", "button-hover-bloom-soft", "button-hover-glow"] },
      { title: "Press", tokens: ["button-press-start", "button-press-end"] }
    ],
    compositions: [
      { title: "Accent buttons", tokens: ["button-face-start", "button-face-end", "button-bloom", "button-glow", "on-accent"], Preview: PrimaryButton }
    ]
  },
  {
    id: "status",
    title: "Status",
    usage:
      "Each status has a ramp: the base for text and icons, deep for emphasis, bg for badges and alerts, wash for a quiet row, line for its border. Always pair the color with a word or icon.",
    sections: [
      { title: "Success", tokens: ["ok", "ok-deep", "ok-bg", "ok-wash", "ok-line"] },
      { title: "Warning", tokens: ["warn", "warn-deep", "warn-bg", "warn-wash", "warn-line"] },
      { title: "Danger", tokens: ["bad", "bad-deep", "bad-bg", "bad-wash", "bad-line", "bad-control", "bad-fill", "bad-hover", "action-danger-surface", "action-danger-hover"] },
      { title: "Info", tokens: ["info", "info-deep", "info-bg", "info-wash", "info-line"] }
    ],
    compositions: [
      { title: "Status badges", tokens: ["ok", "ok-bg", "ok-line", "warn", "warn-bg", "warn-line", "bad", "bad-bg", "bad-line", "info", "info-bg", "info-line"], Preview: StatusBadges },
      { title: "Alerts and a danger action", tokens: ["warn-bg", "warn-line", "warn", "bad-bg", "bad-line", "bad", "bad-fill", "on-bad"], Preview: StatusAlerts }
    ]
  },
  {
    id: "toast",
    title: "Toasts and action bar",
    usage:
      "A separate palette for toasts and the floating action bar. In light they alias the page tokens; in dark they sit a step brighter so they read above any page.",
    sections: [
      { tokens: ["toast-bg", "toast-line", "toast-text", "toast-muted", "toast-ok", "toast-bad"] }
    ],
    compositions: [
      { title: "Toasts", tokens: ["toast-bg", "toast-line", "toast-text", "toast-muted", "toast-ok", "toast-bad"], Preview: Toasts }
    ]
  },
  {
    id: "hues",
    title: "Product hues",
    usage:
      "One hue, many scopes. Set a hue on any element and its descendants get icon, tint, soft and fill colors at a fixed lightness and chroma, so no product reads louder than another. Use subtle where hues share a page, pop inside a single-hue view.",
    sections: [],
    compositions: [
      { title: "Hue scopes", tokens: ["hue-subtle-soft", "hue-subtle-icon", "hue-subtle-fill", "hue-pop-soft", "hue-pop-icon", "hue-pop-fill"], Preview: HueCards }
    ]
  },
  {
    id: "charts",
    title: "Charts",
    usage: "Series colors in order. Use them for data only, from chart-1 up, and label every series.",
    sections: [{ tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6"] }],
    compositions: [
      { title: "Bar chart", tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "chart-6", "line"], Preview: ChartBars }
    ]
  }
];
