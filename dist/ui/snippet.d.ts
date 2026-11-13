import * as React from "react";
export declare function Snippet({ id, "aria-describedby": describedBy, "aria-invalid": invalid, value, prompt, size, copyable, copyLabel, label, onCopy, writeClipboard, maxLines, className, ref }: {
    id?: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
    value: string;
    prompt?: string;
    size?: "sm" | "md";
    copyable?: boolean;
    copyLabel?: string;
    label: string;
    onCopy?: (value: string) => void;
    writeClipboard?: (value: string) => Promise<void>;
    /** Shows the value on several lines: it keeps its line breaks, wraps long lines and grows up to this many lines, then scrolls. Copy still copies the whole value. */
    maxLines?: number;
    className?: string;
} & {
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}): React.JSX.Element;
export declare namespace Snippet {
    var displayName: string;
}
