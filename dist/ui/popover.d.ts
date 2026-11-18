import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
declare function Popover({ open, defaultOpen, onOpenChange, ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>): React.JSX.Element;
declare function PopoverTrigger({ ref, ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>): React.JSX.Element;
declare namespace PopoverTrigger {
    var displayName: string;
}
declare function PopoverContent({ className, collisionPadding, align, sideOffset, surface, draggable, onEscapeKeyDown, onOpenAutoFocus, style, children, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, "draggable"> & {
    surface?: "card" | "menu";
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
declare function PopoverHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace PopoverHeader {
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
export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
