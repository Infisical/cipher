import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { type IconSource } from "./icon";
import type { FieldWidth } from "./input";
export type SelectOption = {
    value: string;
    label: string;
    /** Prose under the label, such as what a role allows. It wraps in full. */
    description?: string;
    /** A short value after the label on the same line, such as a count, region or version. It stays in the menu row, not the trigger, and the label truncates before it does. A string, like ComboboxOption's, so one options array serves both. */
    meta?: string;
    disabled?: boolean;
    group?: string;
    /** A Badge after the label, in the menu row and in the trigger while this option is selected, such as "Current". */
    badge?: React.ReactNode;
    /** A logo or image before the label, sized like an icon, in the menu row and in the trigger while this option is selected. It never shrinks; the label truncates first. */
    media?: React.ReactNode;
};
declare function Select({ options, label, placeholder, size, width, invalid, align, menuWidth, icon, wrap, descriptionLayout, disabledReason, disabled, open: openProp, defaultOpen, onOpenChange, onChange, onValueChange, children, id, "aria-describedby": describedBy, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }: React.ComponentProps<typeof SelectPrimitive.Root> & {
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
    /** @deprecated Ignored. Descriptions always stack under the label; pass short values such as a count, region or version as an option's `meta`. */
    descriptionLayout?: "inline" | "stacked";
    /** Blocks choosing and says why: the trigger looks disabled but stays focusable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. */
    disabledReason?: string;
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
declare function SelectTrigger({ className, size, icon, width, disabledReason, children, onPointerEnter, onFocus, onPointerDown, onClick, onKeyDown, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default" | "md" | "lg";
    icon?: IconSource;
    /** A fixed token width that doesn't shrink. Unset fills the row. */
    width?: FieldWidth;
    /** Blocks choosing and says why: the trigger looks disabled but stays focusable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. */
    disabledReason?: string;
} & {
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>>;
}): React.JSX.Element;
declare namespace SelectTrigger {
    var displayName: string;
}
declare function SelectContent({ className, collisionPadding, children, align, sideOffset, style, wrap, descriptionLayout, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position"> & {
    /** Wrap long option labels instead of truncating them. Defaults to the Select's `wrap`; items can override it. */
    wrap?: boolean;
    /** @deprecated Ignored. Descriptions always stack under the label; pass short values such as a count, region or version as an item's `meta`. */
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
declare function SelectItem({ className, children, description, meta, badge, media, wrap, onFocus, "aria-describedby": describedBy, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    /** Prose under the label, wrapping in full. */
    description?: string;
    /** A short value after the label on the same line, such as a count, region or version. It stays in the menu row, not the trigger, and the label truncates before it does. */
    meta?: React.ReactNode;
    /** A Badge after the label, shown in the menu row and in the trigger while this item is selected. The label truncates before the badge does. */
    badge?: React.ReactNode;
    /** A logo or image before the label, sized like an icon, shown in the menu row and in the trigger while this item is selected. */
    media?: React.ReactNode;
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
declare function SelectScrollUpButton({ className, style, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): React.JSX.Element;
declare namespace SelectScrollUpButton {
    var displayName: string;
}
declare function SelectScrollDownButton({ className, style, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): React.JSX.Element;
declare namespace SelectScrollDownButton {
    var displayName: string;
}
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
