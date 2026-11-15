import * as React from "react";
import { type IconSource } from "./icon";
export interface FileTreeNode {
    id: string;
    name: string;
    type?: "file" | "folder";
    children?: readonly FileTreeNode[];
    meta?: React.ReactNode;
    icon?: IconSource;
    disabled?: boolean;
    label?: string;
}
export interface FileTreeProps {
    items: readonly FileTreeNode[];
    label: string;
    expanded?: readonly string[];
    defaultExpanded?: readonly string[];
    onExpandedChange?: (ids: string[]) => void;
    selected?: string | null;
    defaultSelected?: string | null;
    onSelect?: (id: string, node: FileTreeNode) => void;
    selectable?: "all" | "files" | "folders" | "none";
    foldersOnly?: boolean;
    size?: "sm" | "md";
    maxHeight?: number;
    truncate?: "middle" | "end";
    empty?: React.ReactNode;
}
export declare function FileTree({ items, label, expanded, defaultExpanded, onExpandedChange, selected, defaultSelected, onSelect, selectable, foldersOnly, size, maxHeight, truncate, empty }: FileTreeProps): React.JSX.Element;
