import * as React from "react";
import { type IconSource } from "./icon";
export interface FloatingAction {
    label: string;
    icon?: IconSource;
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
    /** Replaces "Select all {total}", such as "Select first 1,000" when the server caps a bulk selection. */
    selectAllLabel?: string;
    /** Select all is fetching the rest of the rows: the button shows a spinner and ignores clicks, as an action's loading does. */
    selectAllLoading?: boolean;
    actions?: readonly FloatingAction[];
    moreActions?: readonly FloatingAction[];
    onClear: () => void;
    noun?: string;
    /** Shown in a tooltip on the count, on hover and keyboard focus, such as a breakdown of what the count covers. */
    countDetail?: React.ReactNode;
    label?: string;
    className?: string;
};
export declare const FloatingActionBar: ({ count, total, onSelectAll, selectAllLabel, selectAllLoading, actions, moreActions, onClear, noun, countDetail, label, className }: FloatingActionBarProps) => React.JSX.Element;
