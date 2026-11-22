import * as React from "react";
type FrameFoot = {
    target: HTMLElement | null;
    owner: string | null;
    claim: (id: string) => void;
    release: (id: string) => void;
};
/** Marks a subtree as inside a framed container, or, with framed false, starts a fresh surface such as an overlay. */
export declare function FrameScope({ framed, children }: {
    framed: boolean;
    children: React.ReactNode;
}): React.JSX.Element;
/** Offers a frame's empty footer band to one descendant: the first to claim it owns it and portals its footer into target until it releases it. */
export declare function FrameFootSlot({ value, children }: {
    value: FrameFoot | null;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useFrameFoot(): FrameFoot | null;
/**
 * Whether this primitive renders inside a framed container, where it drops its own frame so two frames never nest.
 * Pass the variant the caller asked for to warn in development when an explicit framed variant is dropped.
 */
export declare function useInFrame(component: string, requested?: string): boolean;
export {};
