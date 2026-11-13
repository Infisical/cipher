import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Separator } from "./separator";
import { type IconName } from "./icon";
declare function ItemGroup({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemGroup {
    var displayName: string;
}
declare function ItemSeparator({ className, ref, ...props }: React.ComponentProps<typeof Separator>): React.JSX.Element;
declare namespace ItemSeparator {
    var displayName: string;
}
declare const itemVariants: (props?: ({
    variant?: "default" | "muted" | "outline" | null | undefined;
    size?: "default" | "md" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "title"> & VariantProps<typeof itemVariants> & {
    asChild?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: IconName;
    media?: React.ReactNode;
    badge?: React.ReactNode;
    meta?: React.ReactNode;
    error?: React.ReactNode;
    actions?: React.ReactNode;
    actionsPlacement?: "end" | "below";
    unread?: boolean;
    resolved?: boolean;
    truncate?: boolean;
    mono?: boolean;
};
declare function Item({ className, variant, size, asChild, title, description, icon, media, badge, meta, error, actions, actionsPlacement, unread, resolved, truncate, mono, children, ref, ...props }: ItemProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace Item {
    var displayName: string;
}
declare const itemMediaVariants: (props?: ({
    variant?: "default" | "icon" | "image" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ItemMedia({ className, variant, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof itemMediaVariants> & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace ItemMedia {
    var displayName: string;
}
declare function ItemContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemContent {
    var displayName: string;
}
declare function ItemTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemTitle {
    var displayName: string;
}
declare function ItemDescription({ className, ref, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare namespace ItemDescription {
    var displayName: string;
}
declare function ItemActions({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemActions {
    var displayName: string;
}
declare function ItemHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemHeader {
    var displayName: string;
}
declare function ItemFooter({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemFooter {
    var displayName: string;
}
export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle };
export declare function Media({ icon, size, tone, children, className, style, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    icon?: IconName;
    size?: "sm" | "md" | number;
    tone?: "ok" | "warn" | "bad" | "info";
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Media {
    var displayName: string;
}
export declare function Tile({ selected, title, description, media, children, className, type, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"button">, "title"> & {
    selected?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLButtonElement>;
}): React.JSX.Element;
export declare namespace Tile {
    var displayName: string;
}
