import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { iconShapes } from "./icon-data";
export type IconName = keyof typeof iconShapes;
export declare const iconNames: IconName[];
type IconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "name"> & {
    name?: IconName;
    icon?: LucideIcon;
    size?: number | string;
    label?: string;
};
export declare function Icon({ name, icon: Fallback, size, strokeWidth, label, style, ref, ...props }: IconProps & {
    ref?: React.Ref<SVGSVGElement>;
}): React.JSX.Element | null;
export declare namespace Icon {
    var displayName: string;
}
export {};
