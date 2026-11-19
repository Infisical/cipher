import * as React from "react";
import { type IconSource } from "./icon";
export type CommandMenuItem = {
    id: string;
    label: string;
    icon?: IconSource;
    kind?: CommandMenuItemKind;
    media?: React.ReactNode;
    description?: string;
    meta?: string;
    shortcut?: string;
    keywords?: string[];
    mono?: boolean;
    href?: string;
    onSelect?: () => void | Promise<void>;
    page?: string;
    disabled?: boolean;
    keepOpen?: boolean;
    danger?: boolean;
};
export type CommandMenuItemKind = "page" | "component" | "pattern" | "foundation" | "comparison" | "example" | "action" | "secret" | "setting" | "project" | "organization" | "person";
export type CommandMenuGroup = {
    label: string;
    items: readonly CommandMenuItem[];
    meta?: string;
    limit?: number;
    searchOnly?: boolean;
};
export type CommandMenuProps = {
    groups: readonly CommandMenuGroup[];
    recent?: readonly CommandMenuItem[];
    pages?: Record<string, {
        title: string;
        placeholder?: string;
        groups: readonly CommandMenuGroup[];
    }>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    hotkey?: "mod+k" | false;
    onQueryChange?: (query: string, pageId?: string) => void;
    loading?: boolean;
    filter?: boolean;
    emptyHint?: string;
    footer?: React.ReactNode;
    inline?: boolean;
    label?: string;
};
export declare const CommandMenu: ({ groups, recent, pages, open: controlledOpen, defaultOpen, onOpenChange, hotkey, onQueryChange, loading, filter, emptyHint, footer, inline, label }: CommandMenuProps) => React.JSX.Element;
