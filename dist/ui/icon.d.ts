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
    /** Keeps the icon on the first line of the text beside it as the text wraps (.cipher-lead-line). The row must be a flex row; an Inline with align first-line does this for its first child. */
    lead?: boolean;
};
export declare function Icon({ name: nameProp, icon, size, strokeWidth, label, motion, filled, lead, style, className, ref, ...props }: IconProps & {
    ref?: React.Ref<SVGSVGElement>;
}): React.JSX.Element | null;
export declare namespace Icon {
    var displayName: string;
}
export {};
