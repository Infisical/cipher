import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";
declare function Slider({ className, defaultValue, value, min, max, thumbLabels, "aria-label": label, "aria-labelledby": labelledBy, ref, ...props }: React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    thumbLabels?: readonly string[];
} & {
    ref?: React.Ref<React.ComponentRef<typeof SliderPrimitive.Root>>;
}): React.JSX.Element;
declare namespace Slider {
    var displayName: string;
}
export { Slider };
