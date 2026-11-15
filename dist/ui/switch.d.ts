import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";
declare function Switch({ className, size, label, description, layout, disabledReason, onChange, onClick, onCheckedChange, onPointerEnter, onPointerLeave, onPointerDown, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "onChange"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    layout?: "default" | "row";
    /** Blocks the switch and says why: it stays focusable, shows the reason in a tooltip and exposes it as the accessible description. */
    disabledReason?: string;
    onChange?: (checked: boolean) => void;
} & {
    size?: "sm" | "default";
} & {
    ref?: React.Ref<React.ComponentRef<typeof SwitchPrimitive.Root>>;
}): React.JSX.Element;
declare namespace Switch {
    var displayName: string;
}
export { Switch };
