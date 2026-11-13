import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { iconShapes } from "./icon-data";

export type IconName = keyof typeof iconShapes;
export const iconNames = Object.keys(iconShapes) as IconName[];
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

export function Icon({
  name: nameProp,
  icon,
  size,
  strokeWidth,
  label,
  motion,
  filled,
  style,
  ref,
  ...props
}: IconProps & { ref?: React.Ref<SVGSVGElement> }) {
  const name = nameProp ?? (typeof icon === "string" ? icon : undefined);
  const Component = typeof icon === "string" ? undefined : icon;
  const dimension = typeof size === "number" ? `${size}px` : size;
  const shared = {
    ref,
    "data-slot": "icon",
    role: label ? "img" : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    "data-filled": filled ? "" : undefined,
    focusable: "false" as const,
    style: { width: dimension, height: dimension, strokeWidth, ...style },
    ...props
  };
  if (name)
    return (
      <svg
        {...shared}
        data-icon-name={name}
        data-icon-source="custom"
        data-icon-motion={motion}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconShapes[name].map((shape, index) =>
          React.createElement(shape.tag, {
            ...shape.attributes,
            pathLength: motion ? 1 : undefined,
            key: index
          })
        )}
      </svg>
    );
  if (!Component) return null;
  return <Component {...shared} data-icon-source="lucide" />;
}
Icon.displayName = "Icon";
