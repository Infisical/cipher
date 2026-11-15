import * as React from "react";

import { CipherLink, type CipherLinkProps } from "../lib/link";
import { cn } from "../lib/utils";

import styles from "./link.module.css";

type LinkProps = (CipherLinkProps | (React.ComponentPropsWithRef<"a"> & { href: string })) & {
  /** hover (the default) draws the underline only on hover and keyboard focus. Use always in body-colour prose, where the link has the same colour as the text around it. */
  underline?: "hover" | "always";
};

/** An inline text link for prose and help text. Pass link for a route through the app's router, or href for a plain anchor such as an external page. For a link that fills a table cell, use CellLink. */
function Link({ className, underline = "hover", ...props }: LinkProps) {
  const shared = {
    "data-slot": "link",
    "data-underline": underline,
    className: cn(styles.link, className)
  };
  return "link" in props ? <CipherLink {...props} {...shared} /> : <a {...props} {...shared} />;
}
Link.displayName = "Link";

export { Link };
export type { LinkProps };
