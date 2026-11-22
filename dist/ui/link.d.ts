import * as React from "react";
import { type CipherLinkProps } from "../lib/link";
type LinkProps = (CipherLinkProps | (React.ComponentPropsWithRef<"a"> & {
    href: string;
})) & {
    /** hover (the default) draws the underline only on hover and keyboard focus. Use always in body-colour prose, where the link has the same colour as the text around it. */
    underline?: "hover" | "always";
};
/** An inline text link for prose and help text. Pass link for a route through the app's router, or href for a plain anchor such as an external page. For a link that fills a table cell, use CellLink. */
declare function Link({ className, underline, ...props }: LinkProps): React.JSX.Element;
declare namespace Link {
    var displayName: string;
}
export { Link };
export type { LinkProps };
