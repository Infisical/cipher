import * as React from "react";
export type FieldControlAttributes = Pick<React.AriaAttributes, "aria-describedby" | "aria-invalid" | "aria-labelledby"> & {
    id?: string;
};
export declare const FieldControlContext: React.Context<FieldControlAttributes>;
export type FieldErrorMap = Readonly<Record<string, string | undefined>>;
export declare const FieldErrorsContext: React.Context<{
    errors: FieldErrorMap;
    clear: (name: string) => void;
} | null>;
export declare function useFieldControlAttributes(props: FieldControlAttributes): FieldControlAttributes;
