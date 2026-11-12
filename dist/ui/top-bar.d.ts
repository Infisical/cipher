import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { type PresenceReport } from "../lib/presence-count";
import { type BreadcrumbCrumb } from "./breadcrumb";
import { type IconName } from "./icon";
export type ShellMode = "wide" | "rail" | "narrow";
/** "system", or a theme id from tokens.json themes. */
export type ShellTheme = string;
export interface ShellMenuItem {
    label: string;
    icon?: IconName | LucideIcon;
    href?: string;
    external?: boolean;
    onSelect?: () => void;
    disabled?: boolean;
    disabledReason?: string;
}
export type ShellMenuEntry = ShellMenuItem | {
    type: "separator";
};
export type ShellSheetSlot = "org" | "switchers" | "account" | "icons";
type ShellState = {
    mode: ShellMode;
    narrow: boolean;
    hasNavigation: boolean;
    setHasNavigation: (value: boolean) => void;
    navigationOpen: boolean;
    setNavigationOpen: (open: boolean) => void;
    navigationTrigger: React.RefObject<HTMLButtonElement | null>;
    navigationToggle: React.RefObject<(() => void) | null>;
    toggleNavigation: () => void;
    navigationUnread: boolean;
    setNavigationUnread: (value: boolean) => void;
    slots: Partial<Record<ShellSheetSlot, HTMLElement | null>>;
    setSlot: (slot: ShellSheetSlot, node: HTMLElement | null) => void;
};
export declare const useAppShell: () => ShellState | null;
type ShellChrome = Record<"topBar" | "sidebar" | "sidebarOpen", PresenceReport>;
/** A TopBar or inline Sidebar tells its AppShell it is there, which sets the inset's margins. */
export declare const useShellChrome: () => ShellChrome | null;
/** Pads AppInset by the floating action bar's height, and lifts the scope's toasts above it, while active holds. */
export declare const useActionBarReserve: (active: boolean) => void;
export declare function AppShell({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace AppShell {
    var displayName: string;
}
export declare function AppInset({ className, ref, ...props }: React.ComponentPropsWithoutRef<"main"> & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace AppInset {
    var displayName: string;
}
export declare const scrollInsetTo: (target: HTMLElement) => void;
export declare function PageGutter({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace PageGutter {
    var displayName: string;
}
export declare const ShellMenuItems: ({ entries }: {
    entries: readonly ShellMenuEntry[];
}) => React.JSX.Element[];
export declare const ShellSheetRows: ({ entries, onDone }: {
    entries: readonly ShellMenuEntry[];
    onDone: () => void;
}) => React.JSX.Element[];
export declare const ShellBottomSheet: ({ title, open, onOpenChange, children }: {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}) => React.JSX.Element;
export interface TopBarAccount {
    name: string;
    email?: string;
    items?: readonly ShellMenuEntry[];
    theme?: {
        value: ShellTheme;
        onChange: (value: ShellTheme) => void;
        label?: string;
    };
    endItems?: readonly ShellMenuEntry[];
    label?: string;
}
export interface TopBarNotifications {
    unread?: number;
    onClick?: () => void;
    label?: string;
}
export type TopBarProps = Omit<React.ComponentPropsWithoutRef<"header">, "children"> & {
    breadcrumb: readonly BreadcrumbCrumb[];
    search?: {
        onClick: () => void;
        label?: string;
        shortcut?: string;
    };
    notifications?: TopBarNotifications;
    account?: TopBarAccount;
    actions?: React.ReactNode;
    label?: string;
    navigationLabel?: string;
};
export declare function TopBar({ breadcrumb, search, notifications, account, actions, label, navigationLabel, className, ref, ...props }: TopBarProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace TopBar {
    var displayName: string;
}
export {};
