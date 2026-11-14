import * as React from "react";
/**
 * Augment this interface to type the link target every Cipher component takes, for example
 * `interface CipherRegister { link: LinkOptions }` for a TanStack Router app. A target with
 * `disabled: true` renders RowLink and CardLink as unavailable.
 */
export interface CipherRegister {
}
export type CipherLinkTarget = CipherRegister extends {
    link: infer Target;
} ? Target : {
    href: string;
};
export type CipherLinkProps = Omit<React.ComponentPropsWithoutRef<"a">, "href"> & {
    link: CipherLinkTarget;
    ref?: React.Ref<HTMLAnchorElement>;
};
export type CipherLinkMatch = {
    exact: boolean;
    length: number;
};
export type CipherRouter = {
    /** Renders an anchor for a link target, passing every other prop and the ref to it. */
    Link: React.ComponentType<CipherLinkProps>;
    /** A hook that returns how a link target matches the current location, or undefined when it does not. */
    useLinkMatch: () => (link: CipherLinkTarget) => CipherLinkMatch | undefined;
};
/** Wires the app's router into Cipher once, at the root; without it links render plain anchors. */
export declare function CipherRouterProvider({ router, children }: {
    router: CipherRouter;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function CipherLink(props: CipherLinkProps): React.JSX.Element;
export declare const useCipherLinkMatch: () => (link: CipherLinkTarget) => CipherLinkMatch | undefined;
