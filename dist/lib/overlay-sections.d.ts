import * as React from "react";
type OverlayForm = React.ReactElement<React.ComponentProps<"form"> & {
    "data-slot"?: string;
}>;
type SectionTypes = {
    header: React.ElementType;
    subheader?: React.ElementType;
    body?: React.ElementType;
    footer: React.ElementType;
};
/**
 * Splits overlay children into the shared scroll model: an optional pinned group (everything up to
 * the last subheader, or the last header too with pinHeader), one scroll region and the footers.
 * Fragments are unwrapped, so slots rendered behind a condition still count as direct children.
 * Returns null when no section slot is a direct child, so free-form content (a Sidebar in a Sheet, a
 * command palette) renders untouched. With lookThroughForm, a <form> that is the only child is looked
 * through: its children are split instead, and the result returns the form so Content renders the
 * sections inside it with display: contents, which keeps the same boxes as without the form.
 */
export declare const splitOverlaySections: (children: React.ReactNode, types: SectionTypes, { pinHeader, lookThroughForm }?: {
    pinHeader?: boolean;
    lookThroughForm?: boolean;
}) => {
    pinned: React.ReactNode[];
    scroll: React.ReactNode[];
    footer: React.ReactNode[];
    form: OverlayForm | undefined;
} | null;
export declare const renderInForm: (form: OverlayForm | undefined, slot: string, layout: React.ReactNode) => React.ReactNode;
export {};
