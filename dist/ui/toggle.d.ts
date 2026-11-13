import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
declare const toggleVariants: (props?: ({
    variant?: "default" | "ghost" | "outline" | null | undefined;
    size?: "default" | "lg" | "md" | "sm" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function Toggle({ className, variant, size, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants> & {
    ref?: React.Ref<React.ComponentRef<typeof TogglePrimitive.Root>>;
    /** Toggle is a pressed button, not a switch. Use Switch for checked and onCheckedChange, or pressed here. */
    checked?: never;
    /** Toggle is a pressed button, not a switch. Use Switch for defaultChecked, or defaultPressed here. */
    defaultChecked?: never;
    /** Toggle is a pressed button, not a switch. Use Switch for checked and onCheckedChange, or onPressedChange here. */
    onCheckedChange?: never;
}): React.JSX.Element;
declare namespace Toggle {
    var displayName: string;
}
export { Toggle, toggleVariants };
