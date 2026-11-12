import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
export type SelectOption = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    group?: string;
};
declare function Select({ options, label, placeholder, size, invalid, align, menuWidth, onChange, onValueChange, children, id, "aria-describedby": describedBy, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }: React.ComponentProps<typeof SelectPrimitive.Root> & {
    options?: readonly SelectOption[];
    label?: string;
    placeholder?: string;
    size?: "sm" | "default" | "md" | "lg";
    invalid?: boolean;
    align?: "start" | "center" | "end";
    menuWidth?: React.CSSProperties["width"];
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
declare function SelectTrigger({ className, size, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default" | "md" | "lg";
} & {
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Trigger>>;
}): React.JSX.Element;
declare namespace SelectTrigger {
    var displayName: string;
}
declare function SelectContent({ className, collisionPadding, children, align, sideOffset, style, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>, "position"> & {
    ref?: React.Ref<React.ComponentRef<typeof SelectPrimitive.Content>>;
}): React.JSX.Element;
declare namespace SelectContent {
    var displayName: string;
}
declare function SelectLabel({ className, ref, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): React.JSX.Element;
declare namespace SelectLabel {
    var displayName: string;
}
declare function SelectItem({ className, children, description, "aria-describedby": describedBy, ref, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    description?: string;
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
