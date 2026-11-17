import * as React from "react";
export declare function MiddleTruncate({ children, text, keepEnd, mono, title, className, onCopy, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"span">, "children" | "title"> & {
    children?: string;
    text?: string;
    keepEnd?: number;
    mono?: boolean;
    title?: string | false;
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace MiddleTruncate {
    var displayName: string;
}
