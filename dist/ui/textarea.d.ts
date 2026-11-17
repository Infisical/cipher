import * as React from "react";
declare function Textarea({ className, mono, rows, maxRows, style, ref, ...props }: React.ComponentProps<"textarea"> & {
    mono?: boolean;
    /** The field grows with its content up to this many lines, then scrolls. */
    maxRows?: number;
}): React.JSX.Element;
declare namespace Textarea {
    var displayName: string;
}
export { Textarea };
