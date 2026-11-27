import * as React from "react";
/**
 * A block inside a framed container (a card, sheet section or frame): tinted fill, inset padding and no border.
 * Use it for every block nested in a frame, such as a resource, a template, a summary tile or a drop target,
 * instead of a bordered Card or frame, so two frames never nest.
 */
export declare function Inset({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export declare namespace Inset {
    var displayName: string;
}
