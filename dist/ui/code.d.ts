import * as React from "react";
export type CodeProps = Omit<React.ComponentPropsWithoutRef<"code">, "children"> & {
    code?: string;
    language?: string;
    format?: "syntax" | "plain";
    lineNumbers?: boolean;
    highlight?: readonly number[];
    wrap?: boolean;
    maxLines?: number;
    maxHeight?: React.CSSProperties["maxHeight"];
    label?: string;
} & ({
    block?: false;
    children?: React.ReactNode;
} | {
    block: true;
    children?: string;
});
export declare function Code({ children, code, block, language, format, lineNumbers, highlight, wrap, maxLines, maxHeight, label, className, style, ref, ...props }: CodeProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace Code {
    var displayName: string;
}
