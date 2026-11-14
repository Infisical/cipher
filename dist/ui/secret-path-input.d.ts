import * as React from "react";
import { type InputProps } from "./input";
export type SecretPathInputProps = Omit<InputProps, "value" | "defaultValue" | "onChange" | "type" | "role"> & {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Names of the child folders of the folder onParentPathChange last reported. The input filters them by the segment being typed. */
    folders?: readonly string[];
    /** Called on mount and whenever the typed path enters another folder, with that folder's path ("/" or "/app/api"), so the host loads its children into folders. */
    onParentPathChange?: (parentPath: string) => void;
};
export declare function SecretPathInput({ value: valueProp, defaultValue, onChange, folders, onParentPathChange, mono, disabled, readOnly, onFocus, onBlur, onKeyDown, ref, ...props }: SecretPathInputProps & {
    ref?: React.Ref<HTMLInputElement>;
}): React.JSX.Element;
export declare namespace SecretPathInput {
    var displayName: string;
}
export declare function GlobPatternHelp({ label }: {
    label?: string;
}): React.JSX.Element;
export declare namespace GlobPatternHelp {
    var displayName: string;
}
