import * as React from "react";
import type { Locale, Matcher } from "react-day-picker";
export type DatePickerPreset = {
    label: string;
    date: Date;
};
export type DatePickerProps = Omit<React.ComponentPropsWithoutRef<"button">, "value" | "defaultValue" | "onChange" | "disabled" | "children" | "placeholder"> & {
    value: Date | undefined;
    onValueChange: (value: Date | undefined) => void;
    placeholder?: string;
    /** Days that cannot be picked, as Calendar matchers. An open-ended before or after also stops month navigation there. */
    disabled?: Matcher | Matcher[];
    presets?: readonly DatePickerPreset[];
    align?: "start" | "center" | "end";
    locale?: Partial<Locale>;
    formatDate?: (date: Date) => string;
    ref?: React.Ref<HTMLButtonElement>;
};
export declare function DatePicker({ value, onValueChange, placeholder, disabled, presets, align, locale, formatDate, className, ...props }: DatePickerProps): React.JSX.Element;
export declare namespace DatePicker {
    var displayName: string;
}
