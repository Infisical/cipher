import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";
declare function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>): React.JSX.Element;
declare function SheetTrigger({ ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>): React.JSX.Element;
declare namespace SheetTrigger {
    var displayName: string;
}
declare function SheetClose({ ref, disabled, ...props }: React.ComponentProps<typeof SheetPrimitive.Close>): React.JSX.Element;
declare namespace SheetClose {
    var displayName: string;
}
declare function SheetContent({ className, children, side, size, showCloseButton, pending, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, onOpenAutoFocus, ref, ...props }: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    size?: "sm" | "md" | "lg";
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
declare function SheetDescription({ className, ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>): React.JSX.Element;
declare namespace SheetDescription {
    var displayName: string;
}
export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSections, SheetSubheader, SheetTitle, SheetTrigger };
