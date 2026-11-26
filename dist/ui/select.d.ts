import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { type IconSource } from "./icon";
import type { FieldWidth } from "./input";
export type SelectOption = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    group?: string;
    /** A Badge after the label, in the menu row and in the trigger while this option is selected, such as "Current". */
    badge?: React.ReactNode;
};
declare function Select({ options, label, placeholder, size, width, invalid, align, menuWidth, icon, wrap, descriptionLayout, onChange, onValueChange, children, id, "aria-describedby": describedBy, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }: React.ComponentProps<typeof SelectPrimitive.Root> & {
    options?: readonly SelectOption[];
    label?: string;
    placeholder?: string;
    size?: "sm" | "default" | "md" | "lg";
    /** A fixed token width for the trigger that doesn't shrink. Unset fills the row. */
    width?: FieldWidth;
    invalid?: boolean;
    align?: "start" | "center" | "end";
    menuWidth?: React.CSSProperties["width"];
    /** A glyph at the trigger's start, such as the kind of value it picks. */
    icon?: IconSource;
    /** Wrap long option labels in the list instead of truncating them. The trigger stays on one line. */
    wrap?: boolean;
    /** inline puts an option's description after its label on one line; stacked puts it on the lines below, wrapping in full, for descriptions longer than a few words such as what a role allows. */
    descriptionLayout?: "inline" | "stacked";
    onChange?: (value: string) => void;
    id?: string;
    "aria-describedby"?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
}): React.JSX.Element;
declare function SelectGroup({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): React.JSX.Element;
declare namespace SelectGroup {
    var displayName: string;
}
declare function SelectValue({ ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): React.JSX.Element;
declare namespace SelectValue {
    var displayName: string;
}
declare function SelectTrigger({ className, size, icon, width, children, onPointerEnter, onFocus, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default" | "md" | "lg";
    icon?: IconSource;
    /** A fixed token width that doesn't shrink. Unset fills the row. */
    width?: FieldWidth;
} & {
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>>;
}): React.JSX.Element;
declare namespace SelectTrigger {
    var displayName: string;
}
declare function SelectContent({ className, collisionPadding, children, align, sideOffset, style, wrap, descriptionLayout, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position"> & {
    /** Wrap long option labels instead of truncating them. Defaults to the Select's `wrap`; items can override it. */
    wrap?: boolean;
    /** Where option descriptions go: after the label on one line, or stacked below it and wrapping in full. Defaults to the Select's descriptionLayout. */
    descriptionLayout?: "inline" | "stacked";
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Content>>;
}): React.JSX.Element;
declare namespace SelectContent {
    var displayName: string;
}
declare function SelectLabel({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): React.JSX.Element;
declare namespace SelectLabel {
    var displayName: string;
}
declare function SelectItem({ className, children, description, badge, wrap, onFocus, "aria-describedby": describedBy, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    description?: string;
    /** A Badge after the label, shown in the menu row and in the trigger while this item is selected. The label truncates before the badge does. */
    badge?: React.ReactNode;
    /** Wrap this label instead of truncating it. Defaults to the content's `wrap`. */
    wrap?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Item>>;
}): React.JSX.Element;
declare namespace SelectItem {
    var displayName: string;
}
declare function SelectSeparator({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): React.JSX.Element;
declare namespace SelectSeparator {
    var displayName: string;
}
declare function SelectScrollUpButton({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): React.JSX.Element;
declare namespace SelectScrollUpButton {
    var displayName: string;
}
declare function SelectScrollDownButton({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): React.JSX.Element;
declare namespace SelectScrollDownButton {
    var displayName: string;
}
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
