import * as React from "react";
import { type IconSource } from "./icon";
declare const badgeVariants: (props?: import("class-variance-authority/types").ClassProp | undefined) => string;
export type BadgeTone = "outline" | "soft" | "ok" | "warn" | "bad" | "info" | "solid" | "accent";
type LegacyBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
declare function Badge({ className, variant, tone, dot, icon, media, size, mono, collapse, reason, children, asChild, ref, onPointerEnter, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    asChild?: boolean;
    tone?: BadgeTone;
    /** @deprecated Use tone. Each value maps to a tone: default solid, secondary soft, destructive bad, the rest outline. */
    variant?: LegacyBadgeVariant;
    dot?: boolean;
    /** A leading glyph, decorative: the text stays the badge's name. */
    icon?: IconSource;
    /** A logo or image before the label: 14px beside the default label, the glyph size in the sm and control sizes. It never shrinks; under collapse the label truncates and the media stays. Ignored when icon is set. */
    media?: React.ReactNode;
    size?: "sm" | "md" | "control-sm" | "control-md" | "control-lg";
    mono?: boolean;
    /** Lets the badge give up width under pressure, as in a NameLine or a narrow cell: an icon or dot badge drops to its glyph and a text badge truncates to about 6ch. */
    collapse?: boolean;
    /** Says why the badge reads as it does, such as the error behind a failed status: it becomes a tab stop, shows the reason in a tooltip and exposes it as the accessible description. */
    reason?: React.ReactNode;
} & {
    ref?: React.Ref<React.ComponentRef<"span">>;
}): React.JSX.Element;
declare namespace Badge {
    var displayName: string;
}
declare function BadgeGroup({ className, wrap, children, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    wrap?: boolean;
} & {
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
/** A title followed by its count, as List and Heading show it. A number or string becomes the accent Count. */
export declare function TitleCount({ count, wrap, children }: {
    count: React.ReactNode;
    /** Lets the title wrap with the count after its last word, instead of truncating beside a fixed count. */
    wrap?: boolean;
    children: React.ReactNode;
}): React.JSX.Element;
export declare namespace TitleCount {
    var displayName: string;
}
