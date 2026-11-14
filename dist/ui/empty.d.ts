import * as React from "react";
import { type IconSource } from "./icon";
type EmptySize = "default" | "sm";
declare function Empty({ className, size, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    size?: EmptySize;
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
export declare const EmptyState: ({ title, description, actions, icon, media, size }: {
    title: string;
    description?: string;
    actions?: React.ReactNode;
    icon?: IconSource;
    media?: EmptyMediaVariant;
    size?: EmptySize;
}) => React.JSX.Element;
