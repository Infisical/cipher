import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { iconShapes } from "./icon-data";
export type IconName = keyof typeof iconShapes;
export declare const iconNames: IconName[];
export type IconComponent = LucideIcon;
/** A Cipher glyph by name, or an icon component such as a Lucide icon. Every Cipher prop that takes an icon accepts either. */
export type IconSource = IconName | IconComponent;
type IconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "name"> & {
    name?: IconName;
    icon?: IconSource;
    size?: number | string;
    label?: string;
    /** draw redraws the icon's strokes when the Card around it is hovered or focused. Ignored for Lucide fallbacks and under reduced motion. */
    motion?: "draw";
    /** Fills the glyph, for the on state of a toggle such as a favorite star. The fill takes the product hue inside a hue scope, else the current color. */
    filled?: boolean;
};
export declare function Icon({ name: nameProp, icon, size, strokeWidth, label, motion, filled, style, ref, ...props }: IconProps & {
    ref?: React.Ref<SVGSVGElement>;
}): React.JSX.Element | null;
export declare namespace Icon {
    var displayName: string;
}
export {};
