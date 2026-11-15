import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
type SheetSize = "sm" | "md" | "lg";
declare function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>): React.JSX.Element;
declare function SheetTrigger({ ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>): React.JSX.Element;
declare namespace SheetTrigger {
    var displayName: string;
}
declare function SheetClose({ ref, disabled, onClick, ...props }: React.ComponentProps<typeof SheetPrimitive.Close>): React.JSX.Element;
declare namespace SheetClose {
    var displayName: string;
}
declare function SheetContent({ className, children, side, size, showCloseButton, pending, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, onOpenAutoFocus, ref, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    size?: SheetSize;
    showCloseButton?: boolean;
    /** While true, Escape, outside clicks and every close control are blocked, so an in-flight save cannot be abandoned. */
    pending?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Content>>;
}): React.JSX.Element;
declare namespace SheetContent {
    var displayName: string;
}
/**
 * The pinned layout for content that SheetContent cannot see: a view component that renders its own
 * header and footer, or a header wrapped in another component. header and footer are pinned and
 * children scroll between them, so pinning never depends on what the direct children are.
 */
declare function SheetSections({ header, footer, children, className, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace SheetSections {
    var displayName: string;
}
type SheetViewProps = {
    id: string;
    /** Names the view in a child's breadcrumb, such as the folder a New alert view belongs to. */
    title: string;
    /** The view Back returns to. Defaults to the first view. */
    parent?: string;
    /** The first view's own header, usually a SheetHeader with the SheetTitle. Child views get a back control and a breadcrumb title instead. */
    header?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    /** Widens the sheet while this view is shown. */
    size?: SheetSize;
    /** Back, Escape and the close button ask before leaving a view with unsaved changes. */
    dirty?: boolean;
    discardTitle?: string;
    discardDescription?: string;
    children?: React.ReactNode;
};
/** One level of a SheetViews stack. SheetViews reads its props; it renders nothing on its own. */
declare function SheetView(_: SheetViewProps): React.ReactNode;
declare namespace SheetView {
    var displayName: string;
}
type SheetViewSlots = {
    subheader: HTMLElement | null;
    footer: HTMLElement | null;
    /** Leaves the view through its discard guard, as Back does. onLeave runs once leaving is accepted. */
    back: (onLeave?: () => void) => void;
    /** Leaves the view without asking, once its work is saved. */
    done: () => void;
    setPending: (pending: boolean) => void;
};
/** The view a component renders in, for MultiStep's view variant: its subheader and footer slots and its exits. */
declare const useSheetView: () => SheetViewSlots | null;
/**
 * A stack of views inside one SheetContent, such as a folder and a New alert flow opened from it.
 * The first SheetView is the base. Showing another view keeps the views under it mounted but hidden,
 * so their scroll and unsaved edits survive, and gives it a back control and a breadcrumb title.
 * Back, Escape, and Cancel on a nested MultiStep's first step return to the parent view; the close
 * button closes the whole sheet. Each asks first when a view it leaves is dirty.
 */
declare function SheetViews({ view, onViewChange, children }: {
    view: string;
    onViewChange: (view: string) => void;
    children: React.ReactNode;
}): React.JSX.Element;
declare namespace SheetViews {
    var displayName: string;
}
declare function SheetHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace SheetHeader {
    var displayName: string;
}
declare function SheetSubheader({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace SheetSubheader {
    var displayName: string;
}
declare function SheetBody({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace SheetBody {
    var displayName: string;
}
declare function SheetFooter({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace SheetFooter {
    var displayName: string;
}
declare function SheetTitle({ className, ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>): React.JSX.Element;
declare namespace SheetTitle {
    var displayName: string;
}
declare function SheetDescription({ className, ref, asChild, id, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>): React.JSX.Element;
declare namespace SheetDescription {
    var displayName: string;
}
export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSections, SheetSubheader, SheetTitle, SheetTrigger, SheetView, SheetViews, useSheetView };
