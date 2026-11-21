import * as React from "react";
export type TagsInputProps = {
    value?: readonly string[];
    defaultValue?: readonly string[];
    onChange?: (tags: string[]) => void;
    onValueChange?: (tags: string[]) => void;
    /** Names the text input for assistive technology; the visible label comes from a Field. */
    label: string;
    placeholder?: string;
    id?: string;
    "aria-describedby"?: string;
    disabled?: boolean;
    invalid?: boolean;
    mono?: boolean;
    /** Returns why a tag is refused. A refused tag stays in the input so it can be corrected. */
    validate?: (tag: string, tags: readonly string[]) => string | undefined;
    /** Runs on every commit with the first refusal reason, or undefined when nothing was refused. */
    onValidationChange?: (reason: string | undefined) => void;
    className?: string;
};
export declare function TagsInput({ value, defaultValue, onChange, onValueChange, label, placeholder, disabled, invalid, mono, validate, onValidationChange, className, ref, ...props }: TagsInputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace TagsInput {
    var displayName: string;
}
