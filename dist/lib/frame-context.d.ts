import * as React from "react";
/** Marks a subtree as inside a framed container, or, with framed false, starts a fresh surface such as an overlay. */
export declare function FrameScope({ framed, children }: {
    framed: boolean;
    children: React.ReactNode;
}): React.JSX.Element;
/**
 * Whether this primitive renders inside a framed container, where it drops its own frame so two frames never nest.
 * Pass the variant the caller asked for to warn in development when an explicit framed variant is dropped.
 */
export declare function useInFrame(component: string, requested?: string): boolean;
