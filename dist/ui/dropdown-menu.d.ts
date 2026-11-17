import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
declare function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>): React.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>): React.JSX.Element;
declare function DropdownMenuTrigger({ className, asChild, children, ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): React.JSX.Element;
declare namespace DropdownMenuTrigger {
    var displayName: string;
}
declare function DropdownMenuContent({ className, children, collisionPadding, align, sideOffset, ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>): React.JSX.Element;
declare namespace DropdownMenuContent {
    var displayName: string;
}
declare function DropdownMenuGroup({ ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>): React.JSX.Element;
declare namespace DropdownMenuGroup {
    var displayName: string;
}
declare function DropdownMenuItem({ className, inset, variant, description, disabledReason, onSelect, onClick, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
    description?: React.ReactNode;
    /** Blocks the item and says why: it stays reachable by keyboard, shows the reason in place of the description, exposes it as the accessible description and never runs onSelect. */
    disabledReason?: string;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Item>>;
}): React.JSX.Element;
declare namespace DropdownMenuItem {
    var displayName: string;
}
declare function DropdownMenuCheckboxItem({ className, children, description, checked, inset, onSelect, closeOnSelect, ref, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
    description?: React.ReactNode;
    closeOnSelect?: boolean;
} & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>>;
}): React.JSX.Element;
declare namespace DropdownMenuCheckboxItem {
    var displayName: string;
}
declare function DropdownMenuRadioGroup({ ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): React.JSX.Element;
declare namespace DropdownMenuRadioGroup {
    var displayName: string;
}
declare function DropdownMenuRadioItem({ className, children, description, inset, onSelect, closeOnSelect, ref, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
    description?: React.ReactNode;
    closeOnSelect?: boolean;
} & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>>;
}): React.JSX.Element;
declare namespace DropdownMenuRadioItem {
    var displayName: string;
}
declare function DropdownMenuLabel({ className, inset, ref, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.Label>>;
}): React.JSX.Element;
declare namespace DropdownMenuLabel {
    var displayName: string;
}
declare function DropdownMenuSeparator({ className, ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>): React.JSX.Element;
declare namespace DropdownMenuSeparator {
    var displayName: string;
}
declare function DropdownMenuShortcut({ className, children, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace DropdownMenuShortcut {
    var displayName: string;
}
declare function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>): React.JSX.Element;
declare function DropdownMenuSubTrigger({ className, inset, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>>;
}): React.JSX.Element;
declare namespace DropdownMenuSubTrigger {
    var displayName: string;
}
declare function DropdownMenuSubContent({ className, children, collisionPadding, sideOffset, alignOffset, ref, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>): React.JSX.Element;
declare namespace DropdownMenuSubContent {
    var displayName: string;
}
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger };
