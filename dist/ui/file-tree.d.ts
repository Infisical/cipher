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
    /** Buttons at the end of a row, shown while the row is hovered, focused or selected. */
    renderActions?: (node: FileTreeNode) => React.ReactNode;
    /** ContextMenuItem elements for a row's right-click and Shift+F10 menu. */
    renderContextMenu?: (node: FileTreeNode) => React.ReactNode;
    /** The row whose name is being edited in place. F2 starts it when onRename is set. */
    renaming?: string | null;
    onRenamingChange?: (id: string | null) => void;
    /** Called with a changed, non-empty name. Return a message to keep editing and show it. */
    onRename?: (id: string, name: string, node: FileTreeNode) => string | void | Promise<string | void>;
}
export declare function FileTree({ items, label, expanded, defaultExpanded, onExpandedChange, selected, defaultSelected, onSelect, selectable, foldersOnly, size, maxHeight, truncate, empty, renderActions, renderContextMenu, renaming, onRenamingChange, onRename }: FileTreeProps): React.JSX.Element;
