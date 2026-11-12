import * as React from "react";
declare function Skeleton({ className, width, height, lines, style, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    width?: React.CSSProperties["width"];
    height?: React.CSSProperties["height"];
    lines?: number;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Skeleton {
    var displayName: string;
}
export { Skeleton };
