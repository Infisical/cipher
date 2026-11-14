import * as React from "react";
export type SpinnerSize = "inline" | "base" | "page";
type SpinnerProps = Omit<React.ComponentPropsWithoutRef<"svg">, "children"> & {
    size?: SpinnerSize;
    label?: string;
    description?: string;
    delay?: number;
};
export declare function Spinner({ size, label, description, delay, className, ref, ...props }: SpinnerProps & {
    ref?: React.Ref<SVGSVGElement>;
}): React.JSX.Element | null;
export declare namespace Spinner {
    var displayName: string;
}
export {};
