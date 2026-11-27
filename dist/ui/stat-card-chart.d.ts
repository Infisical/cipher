import * as React from "react";
export type StatCardChartProps = {
    /** One number per point, oldest first. The last point sits on the card's right edge. */
    data: readonly number[];
    /** Names the series for assistive tech, such as Secret reads. */
    label: string;
    /** step holds each value until the next point, for counts that change in jumps. */
    curve?: "linear" | "step";
    /** What the trend shows, read in place of the chart, such as "Up from 8,120 to 12,480 over 7 days". Defaults to the first, last, lowest and highest values. */
    summary?: string;
};
/** An area chart for a StatCard's chart slot. Its fill reaches the band's bottom edge, the line keeps 12px of headroom and stays 6px above the bottom, and it takes the band's height. Inside hueScope it draws in the product's hue. */
export declare function StatCardChart({ data, label, curve, summary }: StatCardChartProps): React.JSX.Element;
