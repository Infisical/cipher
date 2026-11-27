import * as React from "react";
import { type BreadcrumbCrumb } from "./breadcrumb";
import { type IconSource } from "./icon";
export type PageHeaderMoreAction = {
    label: string;
    icon?: IconSource;
    /** Navigates instead of acting in place: renders a link, as a button and as a menu item. */
    href?: string;
    onSelect?: () => void;
    variant?: "default" | "destructive";
    disabledReason?: string;
};
/** The org, sub-org or other scope the page belongs to, shown on one line above the title. */
export type PageHeaderScope = {
    label: string;
    icon?: IconSource;
};
export type PageHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "title"> & {
    title: React.ReactNode;
    size?: "lg" | "md";
    mono?: boolean;
    breadcrumb?: readonly BreadcrumbCrumb[];
    maxItems?: number;
    /** Truncates before the title does, with the full label on hover. */
    scope?: PageHeaderScope;
    /** Right after the title: status badges, and the page's DocumentationLink so it stays paired with the title. */
    badges?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    /**
     * Secondary actions, drawn as outline buttons before `actions` while the header is wide. Below the
     * narrow breakpoint they move into a "More actions" menu to leave more room for the title.
     * Existing `actions` keep their usual responsive behavior.
     */
    moreActions?: readonly PageHeaderMoreAction[];
    moreLabel?: string;
    tabs?: React.ReactNode;
    /** Leading logo or icon. On a narrow header it drops when the title would otherwise be cut. */
    media?: React.ReactNode;
    /** Keeps a long title on one line, ending in an ellipsis with the full title on hover, instead of wrapping. */
    truncateTitle?: boolean;
};
export declare function PageHeader({ title, size, mono, breadcrumb, maxItems, scope, badges, description, actions, moreActions, moreLabel, tabs, media, truncateTitle, className, ref, ...props }: PageHeaderProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace PageHeader {
    var displayName: string;
}
