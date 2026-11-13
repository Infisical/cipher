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
};
/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card spreads it into larger cells and raises its strength. */
export declare function Halftone({ anchor, reach, depth, density, intensity, tone, seed, className, style, ref, ...props }: HalftoneProps & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Halftone {
    var displayName: string;
}
