import * as React from "react";
import { type CipherLinkTarget } from "../lib/link";
import { type SwitcherProps } from "./switcher";
export type BreadcrumbSwitcher = Omit<SwitcherProps, "trigger" | "anchor">;
export type BreadcrumbCrumb = {
    label: React.ReactNode;
    link?: CipherLinkTarget;
    href?: string;
    onNavigate?: React.MouseEventHandler<HTMLElement>;
    mono?: boolean;
    media?: React.ReactNode;
    switcher?: BreadcrumbSwitcher;
};
declare function BandDivider({ className }: {
    className?: string;
}): React.JSX.Element;
declare namespace BandDivider {
    var displayName: string;
}
export type BreadcrumbProps = React.ComponentPropsWithoutRef<"nav"> & {
    items?: readonly BreadcrumbCrumb[];
    variant?: "default" | "product";
    maxItems?: number;
    lastIsCurrent?: boolean;
};
declare function Breadcrumb({ className, items, variant, maxItems, lastIsCurrent, children, ref, ...props }: BreadcrumbProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
declare namespace Breadcrumb {
    var displayName: string;
}
declare function BreadcrumbList({ className, ref, ...props }: React.ComponentProps<"ol">): React.JSX.Element;
declare namespace BreadcrumbList {
    var displayName: string;
}
declare function BreadcrumbItem({ className, ref, ...props }: React.ComponentProps<"li">): React.JSX.Element;
declare namespace BreadcrumbItem {
    var displayName: string;
}
declare function BreadcrumbLink({ asChild, className, ref, ...props }: React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
} & {
    ref?: React.Ref<React.ComponentRef<"a">>;
}): React.JSX.Element;
declare namespace BreadcrumbLink {
    var displayName: string;
}
declare function BreadcrumbPage({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace BreadcrumbPage {
    var displayName: string;
}
declare function BreadcrumbSeparator({ children, className, ref, ...props }: React.ComponentProps<"li">): React.JSX.Element;
declare namespace BreadcrumbSeparator {
    var displayName: string;
}
declare function BreadcrumbEllipsis({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace BreadcrumbEllipsis {
    var displayName: string;
}
export { BandDivider, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };
