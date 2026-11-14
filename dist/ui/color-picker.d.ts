import * as React from "react";
import { type InputProps } from "./input";
export type ColorPreset = {
    name: string;
    value: string;
};
export declare const tagColorPresets: readonly ColorPreset[];
export type ColorPickerProps = Omit<InputProps, "value" | "defaultValue" | "onChange" | "trailing" | "mono" | "kbd" | "icon" | "type"> & {
    value: string;
    onChange: (value: string) => void;
    presets?: readonly ColorPreset[];
    ref?: React.Ref<HTMLInputElement>;
};
export declare function ColorPicker({ value, onChange, presets, disabled, readOnly, placeholder, ...props }: ColorPickerProps): React.JSX.Element;
export declare namespace ColorPicker {
    var displayName: string;
}
