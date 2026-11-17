import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
declare function Avatar({ className, size, name, initials, label, kind, status, ring, children, ref, ...props }: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
    size?: "default" | "sm" | "lg" | number;
    name?: string;
    initials?: string;
    label?: string;
    status?: "ok" | "warn" | "off";
    ring?: boolean;
    kind?: "person" | "machine" | "agent" | "fallback";
} & {
    ref?: React.Ref<React.ComponentRef<typeof AvatarPrimitive.Root>>;
}): React.JSX.Element | null;
declare namespace Avatar {
    var displayName: string;
}
declare function AvatarImage({ className, ref, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>): React.JSX.Element;
declare namespace AvatarImage {
    var displayName: string;
}
declare function AvatarFallback({ className, ref, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>): React.JSX.Element;
declare namespace AvatarFallback {
    var displayName: string;
}
declare function AvatarBadge({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace AvatarBadge {
    var displayName: string;
}
declare function AvatarGroup({ className, children, max, size, label, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    max?: number;
    size?: number;
    label?: string;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace AvatarGroup {
    var displayName: string;
}
declare function AvatarGroupCount({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace AvatarGroupCount {
    var displayName: string;
}
export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
export declare const Identity: ({ name, description, mono, media, title, kind, className }: {
    name: string;
    description?: string;
    mono?: boolean;
    media?: React.ReactNode;
    title?: React.ReactNode;
    kind?: "person" | "machine" | "agent" | "fallback";
    className?: string;
}) => React.JSX.Element;
