import * as React from "react";
export interface CopyButtonProps {
    value: string | (() => Promise<string>);
    label?: string;
    onCopy?: (value: string) => void;
    writeClipboard?: (value: string) => Promise<void>;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    iconOnly?: boolean;
}
export declare function writeClipboard(value: string): Promise<void>;
export declare function CopyButton({ value, label, onCopy, writeClipboard: writer, disabled, size, iconOnly }: CopyButtonProps): React.JSX.Element;
export interface SecretValueProps {
    value: string;
    copyable?: boolean;
    label?: string;
    onCopy?: CopyButtonProps["onCopy"];
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
}
export declare function SecretValue({ value, copyable, label, onCopy, id, ...aria }: SecretValueProps): React.JSX.Element;
export interface StoredSecret {
    id: string;
    revision: string;
    hasValue: boolean;
}
export interface SensitiveEditorProps {
    stored: StoredSecret;
    label: string;
    multiline?: boolean;
    readOnly?: boolean;
    onReveal?: (context: {
        signal: AbortSignal;
    }) => Promise<string>;
    onSave?: (value: string, context: {
        signal: AbortSignal;
        stored: StoredSecret;
    }) => Promise<void>;
    onCopy?: CopyButtonProps["onCopy"];
    copyable?: boolean;
}
export declare function SensitiveEditor({ stored, label, multiline, readOnly, onReveal, onSave, onCopy, copyable }: SensitiveEditorProps): React.JSX.Element;
