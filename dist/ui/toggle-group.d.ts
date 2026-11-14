import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { toggleVariants } from "./toggle";
declare function ToggleGroup({ className, variant, size, spacing, orientation, bare, width, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
    bare?: boolean;
    width?: "content" | "full";
} & {
    ref?: React.Ref<React.ComponentRef<typeof ToggleGroupPrimitive.Root>>;
}): React.JSX.Element;
declare namespace ToggleGroup {
    var displayName: string;
}
declare function ToggleGroupItem({ className, children, variant, size, ref, ...props }: React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & VariantProps<typeof toggleVariants> & {
    ref?: React.Ref<React.ComponentRef<typeof ToggleGroupPrimitive.Item>>;
}): React.JSX.Element;
declare namespace ToggleGroupItem {
    var displayName: string;
}
export { ToggleGroup, ToggleGroupItem };
