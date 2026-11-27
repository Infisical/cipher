import * as React from "react";
import { type IconSource } from "./icon";
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
    icon?: IconSource;
    mono?: boolean;
    invalid?: boolean;
    /** Marks the field invalid and shows this message in a tooltip on hover and while the field has focus, so the field keeps its height, such as an Input in a table cell. Inside a Field, use the Field's error instead. */
    error?: string;
    kbd?: string;
    trailing?: React.ReactNode;
    /** "/" focuses this field from anywhere on the page, for a page's main search. No hint is drawn. */
    slashShortcut?: boolean;
    /** Shown as the placeholder. While the field is empty, Tab or the Tab key cap fills it in, such as a generated name. */
    suggestedValue?: string;
    /** Blocks editing and says why: the field looks disabled but stays focusable and selectable, shows the reason in a tooltip on hover and focus, and exposes it as the accessible description. It replaces readOnly's lock. */
    disabledReason?: string;
    /** A shorter placeholder used when the full one doesn't fit the field on one line. */
    placeholderShort?: string;
};
export declare function Input({ className, type, size, icon, mono, invalid, error, kbd, trailing, width, slashShortcut, suggestedValue, disabledReason, placeholder, placeholderShort, onKeyDown, onClick, onFocus, onBlur, ref, ...props }: InputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace Input {
    var displayName: string;
}
