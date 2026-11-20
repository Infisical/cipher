import * as React from "react";
import { type BreadcrumbCrumb } from "./breadcrumb";
export type PageHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "title"> & {
    title: React.ReactNode;
    size?: "lg" | "md";
    mono?: boolean;
    breadcrumb?: readonly BreadcrumbCrumb[];
    maxItems?: number;
    /** Right after the title: status badges, and the page's DocumentationLink so it stays paired with the title. */
    badges?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    tabs?: React.ReactNode;
    media?: React.ReactNode;
    /** Keeps a long title on one line, ending in an ellipsis with the full title on hover, instead of wrapping. */
    truncateTitle?: boolean;
};
export declare function PageHeader({ title, size, mono, breadcrumb, maxItems, badges, description, actions, tabs, media, truncateTitle, className, ref, ...props }: PageHeaderProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace PageHeader {
    var displayName: string;
}
