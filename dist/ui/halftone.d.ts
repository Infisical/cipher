import * as React from "react";
export type HalftoneAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type HalftoneProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
    anchor?: HalftoneAnchor;
    reach?: number;
    depth?: number;
    density?: number;
    intensity?: number;
    tone?: "hue" | "accent" | "ink";
    /** Warps the falloff and the dither thresholds with coherent noise, so each seed gets its own texture. The same seed always draws the same pattern. */
    seed?: string | number;
    /** Where the wash may reach. header keeps a top-anchored wash inside the card's header, clear of its body and footer. */
    bounds?: "surface" | "header";
    /** Caps the corner at this many halftone cells across and down, at rest and on hover. */
    size?: number;
    /** hover draws nothing at rest and grows the corner out while the card is hovered or focused. */
    reveal?: "always" | "hover";
    /** Cells shimmer in a slow wave travelling out from the anchor. Off under reduced motion. */
    ambient?: boolean;
};
/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card grows the wash outward from its anchor at the same cell size and raises its strength. */
export declare function Halftone({ anchor, reach, depth, density, intensity, tone, seed, bounds, size, reveal, ambient, className, style, ref, ...props }: HalftoneProps & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Halftone {
    var displayName: string;
}
