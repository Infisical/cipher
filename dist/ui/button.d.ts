import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { type IconName } from "./icon";
declare const buttonVariants: (props?: ({
    variant?: "accent" | "bare" | "danger-ghost" | "default" | "destructive" | "ghost" | "link" | "outline" | "primary" | "secondary" | null | undefined;
    size?: "default" | "icon" | "icon-lg" | "icon-row" | "icon-sm" | "icon-xs" | "lg" | "md" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, loading: loadingProp, icon, iconRight, iconOnly, selected, disabledReason, cornerBadge, layout, underline, children, onClickCapture, onPointerDownCapture, onKeyDownCapture, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, style, type, ref, ...props }: React.ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    icon?: IconName;
    iconRight?: IconName;
    iconOnly?: boolean;
    selected?: boolean;
    /** Disables the action and says why: it stays focusable, shows the reason in a tooltip and exposes it as the accessible description. */
    disabledReason?: string;
    /** A small Badge pinned to the top-right corner, straddling the border. It is part of the accessible name and never changes the button's size or hit area. */
    cornerBadge?: React.ReactNode;
    /** trigger: the label sits at the start and truncates and a chevron (iconRight, chev-down by default) sits at the end, with SelectTrigger's padding, for a Button that opens a menu, popover or picker. */
    layout?: "trigger";
    /** For variant link: always (the default) keeps the underline at rest; hover draws it only on hover and keyboard focus, for a record name in a table row. */
    underline?: "always" | "hover";
} & {
    ref?: React.Ref<React.ComponentRef<"button">>;
}): React.JSX.Element;
declare namespace Button {
    var displayName: string;
}
export { Button, buttonVariants };
