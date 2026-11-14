import * as React from "react";
import { type IconName } from "./icon";
/** The state a field box draws from its slotted control or nested field: focus, invalid, disabled and read-only. */
export declare const fieldBoxFlags: {
    "data-control-focus": string;
    "data-control-invalid": string;
    "data-control-input-focus": string;
    "data-control-invalid-focus": string;
    "data-control-disabled": string;
    "data-control-readonly": string;
};
export declare const fieldBoxWatch: {
    attributes: string[];
    focus: boolean;
};
export type FieldWidth = "xs" | "sm" | "md";
export type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "width"> & {
    size?: number | "xs" | "sm" | "md" | "lg";
    /** A fixed token width that doesn't shrink: xs for short numbers, sm for dates, md for short names. Unset fills the row. */
    width?: FieldWidth;
    icon?: IconName;
    mono?: boolean;
    invalid?: boolean;
    kbd?: string;
    trailing?: React.ReactNode;
};
export declare function Input({ className, type, size, icon, mono, invalid, kbd, trailing, width, ref, ...props }: InputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace Input {
    var displayName: string;
}
