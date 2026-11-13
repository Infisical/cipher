import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
export declare function Progress({ className, value, max, label, valueLabel, tone, warnAt, ref, ...props }: React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    label?: string;
    valueLabel?: string;
    tone?: "ink" | "warn" | "bad" | "auto";
    warnAt?: number;
} & {
    ref?: React.Ref<React.ComponentRef<typeof ProgressPrimitive.Root>>;
}): React.JSX.Element;
export declare namespace Progress {
    var displayName: string;
}
export declare const ProgressSteps: ({ steps, current, label, showHeading }: {
    steps: readonly string[];
    current: number;
    label: string;
    /** false drops the label and Step n of N row when the host already shows both, as MultiStep's overlay footer does. */
    showHeading?: boolean;
}) => React.JSX.Element;
