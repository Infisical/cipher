import * as React from "react";
export type FieldControlAttributes = Pick<React.AriaAttributes, "aria-describedby" | "aria-invalid" | "aria-labelledby"> & {
    id?: string;
};
export declare const FieldControlContext: React.Context<FieldControlAttributes>;
export declare function useFieldControlAttributes(props: FieldControlAttributes): FieldControlAttributes;
