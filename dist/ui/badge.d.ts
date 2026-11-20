import * as React from "react";
import { type IconSource } from "./icon";
declare const badgeVariants: (props?: import("class-variance-authority/types").ClassProp | undefined) => string;
export type BadgeTone = "outline" | "soft" | "ok" | "warn" | "bad" | "info" | "solid" | "accent";
type LegacyBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
declare function Badge({ className, variant, tone, dot, icon, size, mono, collapse, children, asChild, ref, onPointerEnter, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    asChild?: boolean;
    tone?: BadgeTone;
    /** @deprecated Use tone. Each value maps to a tone: default solid, secondary soft, destructive bad, the rest outline. */
    variant?: LegacyBadgeVariant;
    dot?: boolean;
    /** A leading glyph, decorative: the text stays the badge's name. */
    icon?: IconSource;
    size?: "sm" | "md" | "control-sm" | "control-md" | "control-lg";
    mono?: boolean;
    /** Lets the badge give up width under pressure, as in a NameLine or a narrow cell: an icon or dot badge drops to its glyph and a text badge truncates to about 6ch. */
    collapse?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"span">>;
}): React.JSX.Element;
declare namespace Badge {
    var displayName: string;
}
declare function BadgeGroup({ className, children, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace BadgeGroup {
    var displayName: string;
}
export { Badge, BadgeGroup, badgeVariants };
export declare function Count({ tone, className, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    /** warn and bad reuse the soft Badge tones, for a count that flags trouble rather than volume. */
    tone?: "accent" | "ink" | "neutral" | "warn" | "bad";
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Count {
    var displayName: string;
}
