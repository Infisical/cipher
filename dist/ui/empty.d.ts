import * as React from "react";
import { type IconSource } from "./icon";
type EmptySize = "default" | "sm";
export type EmptyGhost = "rows" | "cards" | false;
/** Sets the ghost an Empty inside defaults to. Containers with an empty slot use it, so an explicit ghost on the Empty still wins. */
export declare function EmptyGhostScope({ ghost, children }: {
    ghost: EmptyGhost | undefined;
    children: React.ReactNode;
}): React.JSX.Element;
declare function Empty({ className, size, ghost, children, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    size?: EmptySize;
    /**
     * Faded placeholder rows or cards behind the message, hinting at what fills the space. They fade
     * out toward the center, so the message and action never sit on a line. Containers pick it for
     * you: DataTable draws rows, Grid and TilePicker draw cards, and none draw one while filtered or
     * when the table sits flush in a framed Card. A standalone Empty stays plain. Pass a value to
     * override the container, or false to turn it off.
     */
    ghost?: EmptyGhost;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace Empty {
    var displayName: string;
}
declare function EmptyHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace EmptyHeader {
    var displayName: string;
}
export type EmptyMediaVariant = "tile" | "bare";
declare function EmptyMedia({ className, variant, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    variant?: EmptyMediaVariant;
} & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace EmptyMedia {
    var displayName: string;
}
declare function EmptyTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace EmptyTitle {
    var displayName: string;
}
declare function EmptyDescription({ className, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare function EmptyContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace EmptyContent {
    var displayName: string;
}
export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
export declare const EmptyState: ({ title, description, actions, icon, media, size, ghost }: {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    icon?: IconSource;
    media?: EmptyMediaVariant;
    size?: EmptySize;
    ghost?: EmptyGhost;
}) => React.JSX.Element;
