import * as React from "react";
import type { CipherLinkProps } from "../lib/link";
import { Card } from "./card";
import { type IconSource } from "./icon";
export type StatCardProps = Omit<React.ComponentProps<typeof Card>, "title" | "badges" | "description" | "hint" | "action" | "footer" | "footerPlacement" | "children"> & {
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
export declare function StatCard({ label, value, icon, tone, delta, trend, deltaTone, note, link, loading, error, variant, className, ...props }: StatCardProps): React.JSX.Element;
