import * as React from "react";
import { type CodeProps } from "./code";
import { type IconName } from "./icon";
export type CodeBlockProps = Omit<CodeProps, "children" | "block" | "onCopy" | "label"> & {
    children?: React.ReactNode;
    label?: React.ReactNode;
    icon?: IconName;
    actions?: React.ReactNode;
    copyable?: boolean;
    copyValue?: string;
    copyLabel?: string;
    onCopy?: (value: string) => void;
    writeClipboard?: (value: string) => Promise<void>;
};
export declare const CodeBlock: ({ children, code, label, icon, actions, copyable, copyValue, copyLabel, onCopy, writeClipboard, className, ...props }: CodeBlockProps) => React.JSX.Element;
