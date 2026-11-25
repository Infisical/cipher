import * as React from "react";
export declare const KeyGlyph: ({ glyph }: {
    glyph: string;
}) => string | React.JSX.Element;
export type KeyCombo = string | readonly string[] | readonly (readonly string[])[];
export interface KbdProps extends Omit<React.ComponentPropsWithoutRef<"kbd">, "children"> {
    children?: React.ReactNode;
    keys?: KeyCombo;
    /** md is the 20px key cap (size-kbd-md); sm is the 18px cap (size-kbd-sm) for menus, buttons and rows. */
    size?: "sm" | "md";
    platform?: "auto" | "mac" | "other";
}
export declare function shortcutSteps(keys: KeyCombo): readonly (readonly string[])[];
declare function Kbd({ className, children, keys, size, platform, ref, ...props }: KbdProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
declare namespace Kbd {
    var displayName: string;
}
declare function KbdGroup({ className, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
declare namespace KbdGroup {
    var displayName: string;
}
export { Kbd, KbdGroup };
