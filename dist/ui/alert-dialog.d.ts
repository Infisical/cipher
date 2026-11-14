import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "./button";
import { type IconSource } from "./icon";
declare function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>): React.JSX.Element;
declare function AlertDialogTrigger({ ref, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>): React.JSX.Element;
declare namespace AlertDialogTrigger {
    var displayName: string;
}
declare function AlertDialogPortal({ children, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>): React.JSX.Element;
declare function AlertDialogOverlay({ className, ref, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>): React.JSX.Element;
declare namespace AlertDialogOverlay {
    var displayName: string;
}
declare function AlertDialogContent({ className, size, tone, icon, confirmText, pending, onEscapeKeyDown, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & {
    size?: "default" | "sm";
    /** danger shows a bad-tone lead tile (trash unless icon or AlertDialogMedia is given); neutral and unset show no automatic tile. */
    tone?: "danger" | "neutral";
    icon?: IconSource;
    /** The exact text the person types before the action enables. */
    confirmText?: string;
    /** While true, Escape and Cancel are blocked, so an in-flight action cannot be abandoned. An AlertDialogAction with loading sets this for you. */
    pending?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Content>>;
}): React.JSX.Element;
declare namespace AlertDialogContent {
    var displayName: string;
}
declare function AlertDialogHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertDialogHeader {
    var displayName: string;
}
declare function AlertDialogFooter({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertDialogFooter {
    var displayName: string;
}
declare function AlertDialogMedia({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AlertDialogMedia {
    var displayName: string;
}
declare function AlertDialogTitle({ className, ref, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>): React.JSX.Element;
declare namespace AlertDialogTitle {
    var displayName: string;
}
declare function AlertDialogDescription({ className, ref, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>): React.JSX.Element;
declare namespace AlertDialogDescription {
    var displayName: string;
}
declare function AlertDialogAction({ className, variant, size, asChild, disabled, loading, onClick, ref, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & Pick<React.ComponentPropsWithoutRef<typeof Button>, "variant" | "size"> & {
    /** Button's loading: the spinner takes the label's place at the same width and the action stays focusable but cannot fire again. With asChild the composed child gets the same guard, aria-busy and aria-disabled; pass loading to the child too for the spinner. While true, the dialog is pending (Escape and Cancel blocked). Passing loading at all, even false, means the host closes the dialog: a click runs onClick and does not close it. */
    loading?: boolean;
    ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Action>>;
}): React.JSX.Element;
declare namespace AlertDialogAction {
    var displayName: string;
}
declare function AlertDialogCancel({ className, variant, size, asChild, disabled, ref, ...props }: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & Pick<React.ComponentPropsWithoutRef<typeof Button>, "variant" | "size"> & {
    ref?: React.Ref<React.ComponentRef<typeof AlertDialogPrimitive.Cancel>>;
}): React.JSX.Element;
declare namespace AlertDialogCancel {
    var displayName: string;
}
declare function DiscardChangesAlertDialog({ open, onOpenChange, onDiscard, title, description }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDiscard: () => void;
    title?: string;
    description?: string;
}): React.JSX.Element;
declare namespace DiscardChangesAlertDialog {
    var displayName: string;
}
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, DiscardChangesAlertDialog };
