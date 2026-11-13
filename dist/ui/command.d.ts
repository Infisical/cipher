import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Dialog } from "./dialog";
declare function Command({ className, ref, ...props }: React.ComponentProps<typeof CommandPrimitive>): React.JSX.Element;
declare namespace Command {
    var displayName: string;
}
declare function CommandDialog({ title, description, children, className, showCloseButton, onEscapeKeyDown, ...props }: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
}): React.JSX.Element;
declare function CommandInput({ className, trailing, ref, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> & {
    trailing?: React.ReactNode;
} & {
    ref?: React.Ref<React.ComponentRef<typeof CommandPrimitive.Input>>;
}): React.JSX.Element;
declare namespace CommandInput {
    var displayName: string;
}
declare function CommandList({ className, children, ref, style, ...props }: React.ComponentProps<typeof CommandPrimitive.List>): React.JSX.Element;
declare namespace CommandList {
    var displayName: string;
}
declare function CommandEmpty({ className, ref, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>): React.JSX.Element;
declare namespace CommandEmpty {
    var displayName: string;
}
declare function CommandGroup({ className, ref, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>): React.JSX.Element;
declare namespace CommandGroup {
    var displayName: string;
}
declare function CommandSeparator({ className, ref, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>): React.JSX.Element;
declare namespace CommandSeparator {
    var displayName: string;
}
declare function CommandItem({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item> & {
    "data-checked"?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof CommandPrimitive.Item>>;
}): React.JSX.Element;
declare namespace CommandItem {
    var displayName: string;
}
declare function CommandShortcut({ className, children, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace CommandShortcut {
    var displayName: string;
}
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };
