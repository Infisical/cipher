import * as React from "react";
import type { TooltipValueType } from "recharts";
import * as RechartsPrimitive from "recharts";
export declare const chartSeries: readonly ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];
type TooltipNameType = number | string;
export type ChartConfig = Record<string, {
    label?: React.ReactNode;
    icon?: React.ComponentType;
} & ({
    color?: string;
    theme?: never;
} | {
    color?: never;
    theme: Record<"light" | "dark", string>;
})>;
declare function ChartContainer({ id, className, children, config, initialDimension, height, aspect, style, ...props }: React.ComponentProps<"div"> & {
    config: ChartConfig;
    /** A fixed height (a number is pixels). Without aspect, the chart then fills the width at that height instead of 16:9. */
    height?: number | string;
    /** The width-to-height ratio, as a number (2) or a CSS ratio ("21 / 9"). Defaults to 16:9. */
    aspect?: number | string;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
    initialDimension?: {
        width: number;
        height: number;
    };
}): React.JSX.Element;
declare const ChartStyle: ({ id, config }: {
    id: string;
    config: ChartConfig;
}) => React.JSX.Element | null;
declare const ChartTooltip: typeof RechartsPrimitive.Tooltip;
declare function ChartTooltipContent({ active, payload, className, indicator, hideLabel, hideIndicator, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }: React.ComponentProps<typeof RechartsPrimitive.Tooltip> & React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
} & Omit<RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>, "accessibilityLayer">): React.JSX.Element | null;
declare const ChartLegend: React.MemoExoticComponent<(outsideProps: RechartsPrimitive.LegendProps) => React.ReactPortal | null>;
declare function ChartLegendContent({ className, hideIcon, payload, verticalAlign, nameKey }: React.ComponentProps<"div"> & {
    hideIcon?: boolean;
    nameKey?: string;
} & RechartsPrimitive.DefaultLegendContentProps): React.JSX.Element | null;
export { ChartContainer, ChartLegend, ChartLegendContent, ChartStyle, ChartTooltip, ChartTooltipContent };
