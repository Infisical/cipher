import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
declare function Checkbox({ className, label, description, media, indeterminate, onChange, onCheckedChange, ref, ...props }: Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "onChange"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
    /** An icon or logo before the label, sized to size-icon and hidden from assistive technology; anything it means belongs in label. */
    media?: React.ReactNode;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
} & {
    ref?: React.Ref<React.ComponentRef<typeof CheckboxPrimitive.Root>>;
}): React.JSX.Element;
declare namespace Checkbox {
    var displayName: string;
}
export { Checkbox };
