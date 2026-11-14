import * as React from "react";
export declare function PageMeasure({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace PageMeasure {
    var displayName: string;
}
export declare function FormMeasure({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace FormMeasure {
    var displayName: string;
}
export type LayoutGap = 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 48;
type LayoutProps = React.ComponentPropsWithoutRef<"div"> & {
    gap?: LayoutGap;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between";
};
export declare function Stack({ gap, align, justify, style, className, ref, ...props }: LayoutProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Stack {
    var displayName: string;
}
export declare function Inline({ gap, align, justify, wrap, style, className, ref, ...props }: Omit<LayoutProps, "align"> & {
    align?: LayoutProps["align"] | "baseline";
    wrap?: boolean;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Inline {
    var displayName: string;
}
/** An Inline child that takes the row's leftover width, such as a field beside buttons that hug their labels. */
export declare function InlineGrow({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace InlineGrow {
    var displayName: string;
}
export declare function Grid({ gap, columns, min, style, className, ref, ...props }: Omit<LayoutProps, "align" | "justify"> & {
    columns?: 2 | 3 | 4 | "1:2";
    min?: "tile" | "card";
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Grid {
    var displayName: string;
}
export declare function Container({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Container {
    var displayName: string;
}
export declare function Measure({ size, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    size?: "page" | "form" | "prose";
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Measure {
    var displayName: string;
}
export declare function DetailLayout({ aside, asideLabel, children, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    aside: React.ReactNode;
    asideLabel: string;
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace DetailLayout {
    var displayName: string;
}
export {};
