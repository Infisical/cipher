import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
declare function Popover({ open, defaultOpen, onOpenChange, ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>): React.JSX.Element;
declare function PopoverTrigger({ ref, ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>): React.JSX.Element;
declare namespace PopoverTrigger {
    var displayName: string;
}
declare function PopoverContent({ className, collisionPadding, align, sideOffset, surface, size, draggable, onEscapeKeyDown, onOpenAutoFocus, style, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, "draggable"> & {
    surface?: "card" | "menu";
    /**
     * feed is for a panel a person reopens to scan, like notifications, activity, recent items or
     * search results; never for a menu, a select or a short form. It holds a fixed height
     * (size-feed-height, capped at the space below the trigger) whatever the content, pins a
     * PopoverHeader and PopoverFooter while only the body scrolls, and lets an Empty or Loader in the
     * body fill it. Below the mobile breakpoint it opens as a bottom drawer at size-feed-drawer-height
     * on the same open state, dismissed by swiping it down, tapping outside or Escape.
     */
    size?: "feed";
    draggable?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof PopoverPrimitive.Content>>;
}): React.JSX.Element;
declare namespace PopoverContent {
    var displayName: string;
}
declare function PopoverAnchor({ asChild, virtualRef, ref, ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>): React.JSX.Element;
declare namespace PopoverAnchor {
    var displayName: string;
}
declare function PopoverHeader({ className, menu: leading, action, tabs, children, ref, ...props }: React.ComponentProps<"div"> & {
    /** An icon button before the title, such as a DropdownMenu of view options. */
    menu?: React.ReactNode;
    /** An icon button after the title, such as Mark all as read. */
    action?: React.ReactNode;
    /** Underline Tabs or a filter row under the title; at size feed they sit on the header's bottom rule. Pass a controlled Tabs so reopening keeps the active tab. */
    tabs?: React.ReactNode;
}): React.JSX.Element;
declare namespace PopoverHeader {
    var displayName: string;
}
declare function PopoverFooter({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace PopoverFooter {
    var displayName: string;
}
declare function PopoverTitle({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<"h2"> & {
    ref?: React.Ref<HTMLHeadingElement>;
}): React.JSX.Element;
declare namespace PopoverTitle {
    var displayName: string;
}
declare function PopoverDescription({ className, ref, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare namespace PopoverDescription {
    var displayName: string;
}
export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverFooter, PopoverHeader, PopoverTitle, PopoverTrigger };
