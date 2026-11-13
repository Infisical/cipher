import * as React from "react";
import { type BreadcrumbCrumb } from "./breadcrumb";
export type PageHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "title"> & {
    title: React.ReactNode;
    size?: "lg" | "md";
    mono?: boolean;
    breadcrumb?: readonly BreadcrumbCrumb[];
    maxItems?: number;
    badges?: React.ReactNode;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    tabs?: React.ReactNode;
    media?: React.ReactNode;
};
export declare function PageHeader({ title, size, mono, breadcrumb, maxItems, badges, description, actions, tabs, media, className, ref, ...props }: PageHeaderProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace PageHeader {
    var displayName: string;
}
