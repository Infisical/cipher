import * as React from "react";
declare const badgeVariants: (props?: import("class-variance-authority/types").ClassProp | undefined) => string;
export type BadgeTone = "outline" | "soft" | "ok" | "warn" | "bad" | "info" | "solid" | "accent";
type LegacyBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
declare function Badge({ className, variant, tone, dot, size, mono, children, asChild, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    asChild?: boolean;
    tone?: BadgeTone;
    /** @deprecated Use tone. Each value maps to a tone: default solid, secondary soft, destructive bad, the rest outline. */
    variant?: LegacyBadgeVariant;
    dot?: boolean;
    size?: "sm" | "md" | "control-sm" | "control-md" | "control-lg";
    mono?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"span">>;
}): React.JSX.Element;
declare namespace Badge {
    var displayName: string;
}
export { Badge, badgeVariants };
export declare function Count({ tone, className, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    tone?: "accent" | "ink" | "neutral";
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Count {
    var displayName: string;
}
