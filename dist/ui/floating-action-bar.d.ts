import * as React from "react";
import { type IconName } from "./icon";
export interface FloatingAction {
    label: string;
    icon?: IconName;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
    /** Blocks the action and says why, as Button disabledReason: it stays focusable, the reason shows in a tooltip on hover and keyboard focus and is its accessible description. In More it is the item's description. */
    disabledReason?: string;
    loading?: boolean;
}
export type FloatingActionBarProps = {
    count: number;
    total?: number;
    onSelectAll?: () => void;
    actions?: readonly FloatingAction[];
    moreActions?: readonly FloatingAction[];
    onClear: () => void;
    noun?: string;
    label?: string;
    className?: string;
};
export declare const FloatingActionBar: ({ count, total, onSelectAll, actions, moreActions, onClear, noun, label, className }: FloatingActionBarProps) => React.JSX.Element;
