import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
declare function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>): React.JSX.Element;
declare function DialogTrigger({ ref, ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>): React.JSX.Element;
declare namespace DialogTrigger {
    var displayName: string;
}
declare function DialogPortal({ children, ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>): React.JSX.Element;
declare function DialogClose({ ref, disabled, ...props }: React.ComponentProps<typeof DialogPrimitive.Close>): React.JSX.Element;
declare namespace DialogClose {
    var displayName: string;
}
declare function DialogOverlay({ className, ref, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>): React.JSX.Element;
declare namespace DialogOverlay {
    var displayName: string;
}
declare function DialogContent({ className, children, showCloseButton, pending, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
    /** While true, Escape, outside clicks and every close control are blocked, so an in-flight save cannot be abandoned. */
    pending?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
}): React.JSX.Element;
declare namespace DialogContent {
    var displayName: string;
}
declare function DialogHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace DialogHeader {
    var displayName: string;
}
declare function DialogSubheader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace DialogSubheader {
    var displayName: string;
}
declare function DialogFooter({ className, showCloseButton, children, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    showCloseButton?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace DialogFooter {
    var displayName: string;
}
declare function DialogTitle({ className, ref, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>): React.JSX.Element;
declare namespace DialogTitle {
    var displayName: string;
}
declare function DialogDescription({ className, ref, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): React.JSX.Element;
declare namespace DialogDescription {
    var displayName: string;
}
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSubheader, DialogTitle, DialogTrigger };
