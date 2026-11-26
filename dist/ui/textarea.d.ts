import * as React from "react";
declare function Textarea({ className, mono, rows, maxRows, style, placeholder, placeholderShort, ref, ...props }: React.ComponentProps<"textarea"> & {
    mono?: boolean;
    /** A shorter placeholder used when the full one doesn't fit the field on one line. */
    placeholderShort?: string;
    /** The field grows with its content up to this many lines, then scrolls. */
    maxRows?: number;
}): React.JSX.Element;
declare namespace Textarea {
    var displayName: string;
}
export { Textarea };
