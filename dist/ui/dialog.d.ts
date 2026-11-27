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
declare function DialogContent({ className, children, size, showCloseButton, pending, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, onOpenAutoFocus, ref, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** Maximum width: sm (440px) for an ordinary form or confirmation, md (560px) for field pairs, lg (672px) for a dialog built around a table or a preview. */
    size?: "sm" | "md" | "lg";
    showCloseButton?: boolean;
    /** While true, Escape, outside clicks and every close control are blocked, so an in-flight save cannot be abandoned. */
    pending?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof DialogPrimitive.Content>>;
}): React.JSX.Element;
declare namespace DialogContent {
    var displayName: string;
}
declare function DialogHeader({ className, actions, children, ref, ...props }: React.ComponentProps<"div"> & {
    /**
     * Header actions beside the title. When the title does not fit on one line beside the full
     * labels, a Button with a leading icon drops to icon-only, its label becoming the tooltip and
     * accessible name. Icon actions never truncate; one without an icon keeps its label and
     * truncates only as the last resort. Pass Buttons or a ButtonGroup.
     */
    actions?: React.ReactNode;
}): React.JSX.Element;
declare namespace DialogHeader {
    var displayName: string;
}
declare function DialogSubheader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace DialogSubheader {
    var displayName: string;
}
/** The scrolling body between the pinned header and footer; the dialog pad and the content gap come from the dialog, so add no padding of your own. */
declare function DialogBody({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace DialogBody {
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
declare function DialogTitle({ className, ref, badges, ...props }: React.ComponentProps<typeof DialogPrimitive.Title> & {
    /** Right after the title: status badges, and the DocumentationLink so it stays paired with the title. */
    badges?: React.ReactNode;
}): React.JSX.Element;
declare namespace DialogTitle {
    var displayName: string;
}
declare function DialogDescription({ className, ref, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>): React.JSX.Element;
declare namespace DialogDescription {
    var displayName: string;
}
export { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSubheader, DialogTitle, DialogTrigger };
