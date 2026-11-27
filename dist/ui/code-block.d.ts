import * as React from "react";
import { type CodeProps } from "./code";
import { type IconSource } from "./icon";
export type CodeBlockProps = Omit<CodeProps, "children" | "block" | "onCopy" | "label"> & {
    children?: React.ReactNode;
    label?: React.ReactNode;
    icon?: IconSource;
    actions?: React.ReactNode;
    copyable?: boolean;
    copyValue?: string;
    copyLabel?: string;
    onCopy?: (value: string) => void;
    writeClipboard?: (value: string) => Promise<void>;
    /** Masks the content until the reveal toggle is pressed. Copy still writes the real value. */
    sensitive?: boolean;
};
export declare const CodeBlock: ({ children, code, label, icon, actions, copyable, copyValue, copyLabel, onCopy, writeClipboard, sensitive, className, ...props }: CodeBlockProps) => React.JSX.Element;
