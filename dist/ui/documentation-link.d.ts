import * as React from "react";
/**
 * An icon-only link to a feature's documentation. The icon has no text of its own, so it always sits right after
 * the title or label it documents: PageHeader badges, Card badges (plain and framed), or Field help. Never put it
 * alone in an action row, a toolbar or an empty state.
 */
export type DocumentationLinkProps = {
    href: string;
    /** The feature the page documents; the link is announced as "Documentation for <subject>". */
    subject: string;
    /** Glyph size. Without it the link takes the size of where it sits: sm in a field label row or a framed card's eyebrow title, lg beside a page title, md elsewhere. title-lg sits beside a title-lg heading, such as a large dialog title. */
    size?: "sm" | "md" | "lg" | "title-lg";
    className?: string;
};
export declare function DocumentationLink({ href, subject, size, className, ref }: DocumentationLinkProps & {
    ref?: React.Ref<HTMLAnchorElement>;
}): React.JSX.Element;
export declare namespace DocumentationLink {
    var displayName: string;
}
