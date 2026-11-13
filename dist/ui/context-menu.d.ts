import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";
declare function ContextMenu({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Root>): React.JSX.Element;
declare function ContextMenuTrigger({ className, disabled, onKeyDown, onContextMenuCapture, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>): React.JSX.Element;
declare namespace ContextMenuTrigger {
    var displayName: string;
}
declare function ContextMenuGroup({ ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Group>): React.JSX.Element;
declare namespace ContextMenuGroup {
    var displayName: string;
}
declare function ContextMenuPortal({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Portal>): React.JSX.Element;
declare function ContextMenuSub({ ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Sub>): React.JSX.Element;
declare function ContextMenuRadioGroup({ ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>): React.JSX.Element;
declare namespace ContextMenuRadioGroup {
    var displayName: string;
}
declare function ContextMenuContent({ className, children, collisionPadding, onPointerDownCapture, onPointerUpCapture, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Content>): React.JSX.Element;
declare namespace ContextMenuContent {
    var displayName: string;
}
declare function ContextMenuItem({ className, inset, variant, children, description, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    description?: React.ReactNode;
    inset?: boolean;
    variant?: "default" | "destructive";
} & {
    ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.Item>>;
}): React.JSX.Element;
declare namespace ContextMenuItem {
    var displayName: string;
}
declare function ContextMenuSubTrigger({ className, inset, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.SubTrigger>>;
}): React.JSX.Element;
declare namespace ContextMenuSubTrigger {
    var displayName: string;
}
declare function ContextMenuSubContent({ className, children, collisionPadding, sideOffset, alignOffset, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>): React.JSX.Element;
declare namespace ContextMenuSubContent {
    var displayName: string;
}
declare function ContextMenuCheckboxItem({ className, children, description, checked, inset, onSelect, closeOnSelect, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> & {
    description?: React.ReactNode;
    closeOnSelect?: boolean;
} & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>>;
}): React.JSX.Element;
declare namespace ContextMenuCheckboxItem {
    var displayName: string;
}
declare function ContextMenuRadioItem({ className, children, description, inset, onSelect, closeOnSelect, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> & {
    description?: React.ReactNode;
    closeOnSelect?: boolean;
} & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.RadioItem>>;
}): React.JSX.Element;
declare namespace ContextMenuRadioItem {
    var displayName: string;
}
declare function ContextMenuLabel({ className, inset, ref, ...props }: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof ContextMenuPrimitive.Label>>;
}): React.JSX.Element;
declare namespace ContextMenuLabel {
    var displayName: string;
}
declare function ContextMenuSeparator({ className, ref, ...props }: React.ComponentProps<typeof ContextMenuPrimitive.Separator>): React.JSX.Element;
declare namespace ContextMenuSeparator {
    var displayName: string;
}
declare function ContextMenuShortcut({ className, children, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace ContextMenuShortcut {
    var displayName: string;
}
export { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger };
