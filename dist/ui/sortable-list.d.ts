import * as React from "react";
export interface SortableListItemState {
    index: number;
    /** True while the row is held, by pointer or keyboard. */
    dragging: boolean;
    disabled: boolean;
}
export interface SortableListProps<T> {
    items: readonly T[];
    getKey: (item: T) => string;
    /** Called once per committed move: on drop, on a keyboard drop, or on an Alt+Arrow step. Never during a drag. */
    onReorder: (nextItems: T[]) => void;
    renderItem: (item: T, state: SortableListItemState) => React.ReactNode;
    /** The item's name, used for its handle label and the announcements. */
    getLabel: (item: T) => string;
    /** Accessible name of the list. */
    label: string;
    variant?: "framed" | "plain";
    size?: "md" | "sm";
    disabled?: boolean;
    /** A disabled item keeps its handle inert, so it cannot be picked up; other items can still move past it. */
    isItemDisabled?: (item: T) => boolean;
    className?: string;
}
export declare function SortableList<T>({ items, getKey, onReorder, renderItem, getLabel, label, variant: requestedVariant, size, disabled, isItemDisabled, className }: SortableListProps<T>): React.JSX.Element;
