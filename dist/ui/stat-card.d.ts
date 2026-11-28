import * as React from "react";
import type { CipherLinkProps } from "../lib/link";
import { Card } from "./card";
import { type IconSource } from "./icon";
declare const chartHeight: {
    readonly sm: 92;
    readonly md: 168;
};
/** The pixel height of the StatCard chart band the chart sits in, for chart components that fill it. */
export declare const StatCardChartHeight: React.Context<number>;
export type StatCardProps = Omit<React.ComponentProps<typeof Card>, "title" | "badges" | "description" | "hint" | "action" | "children"> & {
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
    /** A control under the note, such as the setup button of a metric that isn't set up yet. */
    action?: React.ReactNode;
    /** A chart after the value, usually a StatCardChart. Hidden while loading or failed. */
    chart?: React.ReactNode;
    /** "bleed" runs the chart to the card's left, right and bottom edges; "inset" keeps it inside the padding. */
    chartPlacement?: "inset" | "bleed";
    /** The chart band's height: sm is 92px, md is 168px. */
    chartSize?: keyof typeof chartHeight;
};
export declare function StatCard({ label, value, icon, tone, delta, trend, deltaTone, note, link, loading, error, action, chart, chartPlacement, chartSize, footer, footerPlacement, variant, className, ...props }: StatCardProps): React.JSX.Element;
export {};
