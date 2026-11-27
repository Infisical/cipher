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
    /** Adds a start and end time under the calendar, so the value carries the time of day and the trigger shows it. New picks start at 00:00 and end at 23:59, and presets keep the times their dates carry. */
    withTime?: boolean;
    /** immediate commits as soon as both ends are picked. apply keeps picks and presets as a draft until Apply, and Cancel or closing discards it. Defaults to apply with withTime, presets or more than one month, so a half-picked range never reaches the value, else immediate. */
    commit?: "immediate" | "apply";
    align?: "start" | "center" | "end";
    locale?: Partial<Locale>;
    formatRange?: (range: CompleteDateRange) => string;
    /** A Badge after the range in the trigger, such as "Current" for the period that is still running. */
    badge?: React.ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
};
/** The range after a click: the first click starts a new range even over a complete one, and the second closes it in either direction. */
export declare const pickRange: (range: DateRange | undefined, day: Date) => DateRange;
export type DateRangePickerContentProps = Pick<DateRangePickerProps, "value" | "disabled" | "numberOfMonths" | "presets" | "withTime" | "commit" | "align" | "locale" | "formatRange"> & {
    /** The month shown first when value is empty. Defaults to the current month. */
    defaultMonth?: Date;
    onValueChange: (value: DateRange | undefined) => void;
    onClose: () => void;
    "aria-label"?: string;
};
/** DateRangePicker's popover for your own trigger, such as a filter chip, with the same presets, months and commit rule. Render it inside a Popover. */
export declare function DateRangePickerContent({ align, numberOfMonths, presets, withTime, commit, "aria-label": ariaLabel, ...props }: DateRangePickerContentProps): React.JSX.Element;
export declare function DateRangePicker({ value, onValueChange, placeholder, disabled, numberOfMonths, presets, withTime, commit, align, locale, formatRange, badge, className, ...props }: DateRangePickerProps): React.JSX.Element;
export declare namespace DateRangePicker {
    var displayName: string;
}
