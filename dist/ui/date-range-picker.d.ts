import * as React from "react";
import type { DateRange, Locale, Matcher } from "react-day-picker";
export type CompleteDateRange = {
    from: Date;
    to: Date;
};
export type DateRangePreset = {
    label: string;
    range: DateRange;
};
export type DateRangePickerProps = Omit<React.ComponentPropsWithoutRef<"button">, "value" | "defaultValue" | "onChange" | "disabled" | "children" | "placeholder"> & {
    value: DateRange | undefined;
    onValueChange: (value: DateRange | undefined) => void;
    placeholder?: string;
    /** Days that cannot be picked, as Calendar matchers. An open-ended before or after also stops month navigation there. */
    disabled?: Matcher | Matcher[];
    numberOfMonths?: number;
    presets?: readonly DateRangePreset[];
    /** immediate commits as soon as both ends are picked. apply keeps picks and presets as a draft until Apply, and Cancel or closing discards it. Defaults to apply with presets or more than one month, else immediate. */
    commit?: "immediate" | "apply";
    align?: "start" | "center" | "end";
    locale?: Partial<Locale>;
    formatRange?: (range: CompleteDateRange) => string;
    ref?: React.Ref<HTMLButtonElement>;
};
/** The range after a click: the first click starts a new range even over a complete one, and the second closes it in either direction. */
export declare const pickRange: (range: DateRange | undefined, day: Date) => DateRange;
export declare function DateRangePicker({ value, onValueChange, placeholder, disabled, numberOfMonths, presets, commit: commitMode, align, locale, formatRange, className, ...props }: DateRangePickerProps): React.JSX.Element;
export declare namespace DateRangePicker {
    var displayName: string;
}
