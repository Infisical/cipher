import * as React from "react";
export declare function AnimatedCollapse({ open, lazy, children, className, style, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    open: boolean;
    lazy?: boolean;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace AnimatedCollapse {
    var displayName: string;
}
