import * as React from "react";
import { type CipherLinkTarget } from "../lib/link";
import { type IconSource } from "./icon";
import { type ShellMenuEntry } from "./top-bar";
export interface SidebarLink {
    id: string;
    label: string;
    icon?: IconSource;
    href?: string;
    onClick?: () => void;
    count?: number;
    external?: boolean;
    disabled?: boolean;
    drillIn?: boolean;
    link?: CipherLinkTarget;
    level?: string;
}
export interface SidebarItem extends SidebarLink {
    children?: readonly SidebarLink[];
    defaultOpen?: boolean;
}
export interface SidebarSection {
    label?: string;
    icon?: IconSource;
    items: readonly SidebarItem[];
}
export interface SidebarSpace {
    id: string;
    label: string;
    icon: IconSource;
    sections: readonly SidebarSection[];
}
export interface SidebarScope {
    id: string;
    back: SidebarLink;
    sections: readonly SidebarSection[];
}
export interface SidebarLevel {
    id: string;
    label: string;
    parent?: string;
    sections: readonly SidebarSection[];
}
export interface SidebarHelp {
    status?: {
        label: string;
        href: string;
        state?: "ok" | "warn" | "bad";
    };
    whatsNew?: {
        onSelect: () => void;
        unread?: number;
        latest?: string;
        label?: string;
    };
    items?: readonly ShellMenuEntry[];
    version?: string;
    label?: string;
}
export interface SidebarAnnouncements {
    unread: number;
    onClick: () => void;
    label?: string;
}
export interface SidebarProps {
    sections?: readonly SidebarSection[];
    levels?: readonly SidebarLevel[];
    scope?: SidebarScope;
    spaces?: readonly SidebarSpace[];
    space?: string;
    defaultSpace?: string;
    onSpaceChange?: (space: string) => void;
    spacesLabel?: string;
    current?: string;
    onNavigate?: (item: SidebarLink) => void;
    help?: SidebarHelp;
    announcements?: SidebarAnnouncements;
    footerItems?: readonly SidebarItem[];
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    collapsible?: boolean;
    header?: React.ReactNode;
    edge?: boolean;
    label?: string;
    className?: string;
}
export declare const Sidebar: (props: SidebarProps) => React.JSX.Element;
