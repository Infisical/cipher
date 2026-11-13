import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";
declare function ScrollArea({ className, children, edgeBehavior, orientation, ref, ...props }: React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    /** What marks an edge with more content past it: a fade (default), a hairline or nothing. */
    edgeBehavior?: "fade" | "border" | "none";
    orientation?: "vertical" | "horizontal" | "both";
} & {
    ref?: React.Ref<React.ComponentRef<typeof ScrollAreaPrimitive.Root>>;
}): React.JSX.Element;
declare namespace ScrollArea {
    var displayName: string;
}
declare function ScrollBar({ className, orientation, ref, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>): React.JSX.Element;
declare namespace ScrollBar {
    var displayName: string;
}
export { ScrollArea, ScrollBar };
