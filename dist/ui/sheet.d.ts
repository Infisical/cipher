import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
type SheetSize = "sm" | "md" | "lg" | "xl";
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
    /** Caps a left or right sheet's width at its size token and three quarters of the viewport. At 512px and below it takes the full viewport width. */
    size?: SheetSize;
    /** A left or right sheet at 512px and below shows the close button even when this is false, since no backdrop is left to tap. */
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
type SheetAsideProps = {
    /** Names the aside landmark and, in the narrow layout, its tab. Defaults to Details. */
    label?: string;
    /**
     * Names the main pane's tab in the narrow layout when the sheet's header has no tabs of its own,
     * such as Configuration. Required because SheetAside cannot see the header; a header with tabs
     * keeps its own labels and this goes unused.
     */
    mainLabel: string;
    className?: string;
    media?: React.ReactNode;
    /** The sheet's title, rendered as its SheetTitle. */
    title: React.ReactNode;
    description?: React.ReactNode;
    badges?: React.ReactNode;
    /** The aside body, such as a summary DataList. */
    children?: React.ReactNode;
};
/**
 * The fixed left pane of a two-pane sheet. It declares the identity (media, title, description,
 * badges) and, as children, the body such as a summary DataList. As a direct child of SheetContent
 * (outside any form) it splits the sheet, and the header, tabs, body, footer or SheetViews beside
 * it form the main pane. Use it with size="xl". Below size-pane-collapse the identity becomes the
 * fixed header and the body becomes the first header tab (label). A header with controlled Tabs
 * and a TabsList keeps its tabs after it; otherwise a second tab, mainLabel, holds the main pane.
 * The sheet opens on the main pane's tab either way. Only a header that is a direct child of
 * SheetContent merges its tabs: beside SheetViews or SheetSections the Details and mainLabel tabs
 * sit above their headers, so keep tabs out of those headers or give the sheet a direct header.
 */
declare function SheetAside(_: SheetAsideProps): React.ReactNode;
declare namespace SheetAside {
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
    /** A child view's header tabs, as SheetHeader `tabs`. The first view sets them on its own header. */
    tabs?: React.ReactNode;
    footer?: React.ReactNode;
    /** Widens the sheet while this view is shown. */
    size?: SheetSize;
    /** Back, Escape and the close button ask before leaving a view with unsaved changes. */
    dirty?: boolean;
    discardTitle?: string;
    discardDescription?: string;
    /** Right after a child view's breadcrumb title, such as its DocumentationLink. The first view sets them on its own SheetTitle. */
    badges?: React.ReactNode;
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
declare function SheetHeader({ className, tabs, actions, children, ref, ...props }: React.ComponentProps<"div"> & {
    /** Underline Tabs that sit on the header's bottom rule, so the active underline lands on it. Pass a controlled Tabs without content and render the panel in the body, giving it role="tabpanel" and linking it to the active trigger. */
    tabs?: React.ReactNode;
    /**
     * Header actions, such as an "Add method" Button. They sit at the end of the tab row when the
     * header has tabs, outside the scrolling tab list, and beside the title otherwise. When the tabs,
     * or the title on one line, do not fit beside the full labels, a Button with a leading icon drops
     * to icon-only, its label becoming the tooltip and accessible name. Icon actions never truncate;
     * one without an icon keeps its label and truncates only as the last resort. Pass Buttons or a
     * ButtonGroup.
     */
    actions?: React.ReactNode;
}): React.JSX.Element;
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
declare function SheetFooter({ className, start, children, ref, ...props }: React.ComponentProps<"div"> & {
    /** Held at the start edge while the children stay at the end, such as Back in a multi-step sheet. */
    start?: React.ReactNode;
}): React.JSX.Element;
declare namespace SheetFooter {
    var displayName: string;
}
declare function SheetTitle({ className, ref, badges, ...props }: React.ComponentProps<typeof SheetPrimitive.Title> & {
    /** Right after the title: status badges, and the DocumentationLink so it stays paired with the title. */
    badges?: React.ReactNode;
}): React.JSX.Element;
declare namespace SheetTitle {
    var displayName: string;
}
declare function SheetDescription({ className, ref, asChild, id, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>): React.JSX.Element;
declare namespace SheetDescription {
    var displayName: string;
}
export { Sheet, SheetAside, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSections, SheetSubheader, SheetTitle, SheetTrigger, SheetView, SheetViews, useSheetView };
