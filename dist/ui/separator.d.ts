import * as React from "react";
import { Separator as SeparatorPrimitive } from "radix-ui";
declare function Separator({ className, orientation, decorative, label, align, soft, ref, ...props }: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    label?: React.ReactNode;
    align?: "start" | "center";
    soft?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof SeparatorPrimitive.Root>>;
}): React.JSX.Element;
declare namespace Separator {
    var displayName: string;
}
export { Separator };
