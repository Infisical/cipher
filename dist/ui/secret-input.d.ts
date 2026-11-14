import * as React from "react";
export declare const HIDDEN_SECRET_VALUE = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";
export type SecretInputProps = Omit<React.ComponentProps<"textarea">, "value" | "defaultValue" | "onChange" | "rows"> & {
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    invalid?: boolean;
};
export declare function SecretInput({ value, onChange, multiline, invalid, className, onFocus, onBlur, ref, ...props }: SecretInputProps): React.JSX.Element;
