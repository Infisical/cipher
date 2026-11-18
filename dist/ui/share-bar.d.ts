import * as React from "react";
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
export declare function ShareBar({ items, label, total, format, legend, max, otherLabel, empty, className, ...props }: ShareBarProps): React.JSX.Element;
export declare namespace ShareBar {
    var displayName: string;
}
