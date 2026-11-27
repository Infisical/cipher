import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
declare function TooltipProvider({ delayDuration, disableHoverableContent, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Provider>): React.JSX.Element;
type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";
/**
 * Shares one tooltip among every Tooltip inside it: each trigger renders only its element, marked with
 * data-cipher-tooltip, and the scope mounts a single Radix tooltip on the first hover or keyboard focus and
 * moves it to whichever trigger is active. Table renders one around its rows.
 */
declare function TooltipScope({ children }: {
    children?: React.ReactNode;
}): React.JSX.Element;
declare function Tooltip({ content, shortcut, side, align, wrap: _wrap, disableHoverableContent, openOnTap, children, ...props }: React.ComponentProps<typeof TooltipPrimitive.Root> & {
    content?: React.ReactNode;
    shortcut?: string;
    side?: TooltipSide;
    align?: TooltipAlign;
    /** @deprecated Tooltips always wrap at size-tooltip-max; this has no effect. */
    wrap?: boolean;
    /** On a touch device a tap on the trigger toggles the tooltip, and a tap elsewhere or Escape closes it. The tap does not activate the trigger. Hover and keyboard focus are unchanged. */
    openOnTap?: boolean;
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
/** True inside a TooltipScope, such as Table rows, where a trigger stays pass-through and needs no tab stop of its own. */
declare function useInTooltipScope(): boolean;
declare function TooltipText({ content, side, align, asChild, openOnTap, className, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"span">, "content"> & {
    /** The supplementary text the tooltip shows on hover and keyboard focus. */
    content: React.ReactNode;
    side?: TooltipSide;
    align?: TooltipAlign;
    /** Make the child element (StatusText, MiddleTruncate) the focusable text instead of a span. In an activatable table row non-interactive text is no tab stop of its own: clicks and Enter reach the row, and the row's description carries the tooltip text. */
    asChild?: boolean;
    openOnTap?: boolean;
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
declare namespace TooltipText {
    var displayName: string;
}
/**
 * Says why: Button's disabledReason and the reason on Badge and StatusText. wrap shows the reason in a
 * tooltip that also opens on a tap on touch devices, adding a provider where none is above it, and with
 * focusable the element becomes a TooltipText tab stop. Put
 * description inside the element and pass its aria-describedby through describedBy, so the reason is
 * its accessible description even while the tooltip is closed.
 */
declare function useReason(reason: React.ReactNode): {
    active: boolean;
    describedBy: (own?: string) => string | undefined;
    description: React.JSX.Element | null;
    wrap: (element: React.ReactElement<{
        onClick?: React.MouseEventHandler<HTMLElement>;
    }>, focusable?: boolean) => React.JSX.Element;
};
export { Tooltip, TooltipContent, TooltipProvider, TooltipScope, TooltipText, TooltipTrigger, useInTooltipScope, useReason };
