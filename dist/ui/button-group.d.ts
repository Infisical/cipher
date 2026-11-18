import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Separator } from "./separator";
declare const buttonGroupVariants: (props?: ({
    orientation?: "horizontal" | "vertical" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ButtonGroup({ className, orientation, variant, label, onKeyDown, onFocus, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof buttonGroupVariants> & {
    variant?: "attached" | "toolbar" | "spaced";
    label?: string;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace ButtonGroup {
    var displayName: string;
}
declare function ButtonGroupText({ className, asChild, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    asChild?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace ButtonGroupText {
    var displayName: string;
}
declare function ButtonGroupSeparator({ className, orientation, ref, ...props }: React.ComponentProps<typeof Separator>): React.JSX.Element;
declare namespace ButtonGroupSeparator {
    var displayName: string;
}
export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };
