import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
declare function TooltipProvider({ delayDuration, disableHoverableContent, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.JSX.Element;
type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";
/**
 * Shares one tooltip among every Tooltip inside it: each trigger renders only its element, marked with
 * data-v4-tooltip, and the scope mounts a single Radix tooltip on the first hover or keyboard focus and
 * moves it to whichever trigger is active. Table renders one around its rows.
 */
declare function TooltipScope({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element;
declare function Tooltip({ content, shortcut, side, align, wrap: _wrap, disableHoverableContent, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root> & {
    content?: React.ReactNode;
    shortcut?: string;
    side?: TooltipSide;
    align?: TooltipAlign;
    /** @deprecated Tooltips always wrap at size-tooltip-max; this has no effect. */
    wrap?: boolean;
}): React.JSX.Element;
/**
 * Opens on hover and on keyboard focus only. Focus that a closing menu, dialog or sheet returns to the
 * trigger never opens it, and after a click it stays closed until the pointer leaves and comes back.
 */
declare function TooltipTrigger({ ref, onPointerDown, onPointerMove, onPointerLeave, onFocus, ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>): React.JSX.Element;
declare namespace TooltipTrigger {
    var displayName: string;
}
declare function TooltipContent({ className, collisionPadding, sideOffset, children, ref, ...props }: React.ComponentProps<typeof TooltipPrimitive.Content>): React.JSX.Element;
declare namespace TooltipContent {
    var displayName: string;
}
declare function TooltipText({ content, side, align, asChild, className, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"span">, "content"> & {
    /** The supplementary text the tooltip shows on hover and keyboard focus. */
    content: React.ReactNode;
    side?: TooltipSide;
    align?: TooltipAlign;
    /** Make the child element (StatusText, MiddleTruncate) the focusable text instead of a span. */
    asChild?: boolean;
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
declare namespace TooltipText {
    var displayName: string;
}
export { Tooltip, TooltipContent, TooltipProvider, TooltipScope, TooltipText, TooltipTrigger };
