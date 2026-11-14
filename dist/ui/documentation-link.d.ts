import * as React from "react";
export type DocumentationLinkProps = {
    href: string;
    /** The feature the page documents; the link is announced as "Documentation for <subject>". */
    subject: string;
    /** Glyph size. Without it the link takes the size of where it sits: sm in a field label row or a framed card's eyebrow title, lg beside a page title, md elsewhere. */
    size?: "sm" | "md" | "lg";
    className?: string;
};
export declare function DocumentationLink({ href, subject, size, className, ref }: DocumentationLinkProps & {
    ref?: React.Ref<HTMLAnchorElement>;
}): React.JSX.Element;
export declare namespace DocumentationLink {
    var displayName: string;
}
