import { type ReactElement, type ReactNode } from "react";
import { type CipherLinkTarget } from "../lib/link";
import { type IconSource } from "./icon";
export interface SwitcherOption {
    value: string;
    label: ReactNode;
    searchText?: string;
    description?: string;
    media?: ReactNode;
    meta?: ReactNode;
    metaMono?: boolean;
    mono?: boolean;
    group?: string;
    disabled?: boolean;
    keywords?: string[];
    onSelect?: () => void;
}
export interface SwitcherAction {
    label: string;
    icon?: IconSource;
    shortcut?: string;
    danger?: boolean;
    disabled?: boolean;
    link?: CipherLinkTarget;
    onSelect?: () => void;
}
export type SwitcherActionDivider = {
    type: "separator";
} | {
    type: "label";
    label: ReactNode;
};
export interface SwitcherProps {
    trigger: ReactElement;
    anchor?: (trigger: ReactElement) => ReactElement;
    options: SwitcherOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, option: SwitcherOption) => void;
    actions?: (SwitcherAction | SwitcherActionDivider)[];
    header?: ReactNode;
    footer?: ReactNode | ((api: {
        close: () => void;
    }) => ReactNode);
    searchable?: boolean;
    placeholder?: string;
    emptyText?: string;
    label: string;
    width?: number;
    maxHeight?: number;
    align?: "start" | "end";
    side?: "bottom" | "top" | "right";
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}
export declare const Switcher: ({ trigger, anchor, options, value, defaultValue, onChange, actions, header, footer, searchable, placeholder, emptyText, label, width, maxHeight, align, side, open, defaultOpen, onOpenChange, className }: SwitcherProps) => import("react").JSX.Element;
