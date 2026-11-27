import * as React from "react";
import { HoverCard as HoverCardPrimitive } from "radix-ui";
declare function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>): React.JSX.Element;
declare function HoverCardTrigger({ ref, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>): React.JSX.Element;
declare namespace HoverCardTrigger {
    var displayName: string;
}
declare function HoverCardContent({ className, collisionPadding, align, sideOffset, width, ref, children, ...props }: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
    /** default is size-popover; sm and md are size-sheet-sm and size-sheet-md, for a table or raw payload; content fits its content up to size-dialog-wide. Every width shrinks to the space available. */
    width?: "default" | "sm" | "md" | "content";
}): React.JSX.Element;
declare namespace HoverCardContent {
    var displayName: string;
}
export { HoverCard, HoverCardContent, HoverCardTrigger };
