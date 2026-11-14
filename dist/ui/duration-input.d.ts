import * as React from "react";
declare const DURATION_UNITS: readonly [{
    readonly value: "s";
    readonly label: "Seconds";
    readonly milliseconds: 1000;
}, {
    readonly value: "m";
    readonly label: "Minutes";
    readonly milliseconds: 60000;
}, {
    readonly value: "h";
    readonly label: "Hours";
    readonly milliseconds: 3600000;
}, {
    readonly value: "d";
    readonly label: "Days";
    readonly milliseconds: 86400000;
}, {
    readonly value: "w";
    readonly label: "Weeks";
    readonly milliseconds: 604800000;
}];
export type DurationUnit = (typeof DURATION_UNITS)[number]["value"];
export type DurationInputProps = {
    value: string;
    onChange: (value: string) => void;
    invalid?: boolean;
    disabled?: boolean;
    placeholder?: string;
    id?: string;
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
};
/**
 * An amount and a unit that read and emit the ms() string main sends for access durations:
 * the amount followed by s, m, h, d or w ("1h", "1.5d"), or "" when the amount is cleared.
 */
export declare function DurationInput({ value, onChange, invalid, disabled, placeholder, ref, ...props }: DurationInputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace DurationInput {
    var displayName: string;
}
export {};
