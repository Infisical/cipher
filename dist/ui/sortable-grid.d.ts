import * as React from "react";
export interface SortableGridItemState {
    index: number;
    /** True while the item is held, by pointer or keyboard. */
    dragging: boolean;
    disabled: boolean;
    /** The item's grip. Place it in the item, such as in a Card's action slot. */
    handle: React.ReactNode;
}
export interface SortableGridProps<T> {
    items: readonly T[];
    getKey: (item: T) => string;
    /** Called once per committed move: on drop, on a keyboard drop, or on an Alt+Arrow step. Never during a drag. */
    onReorder: (nextItems: T[]) => void;
    renderItem: (item: T, state: SortableGridItemState) => React.ReactNode;
    /** The item's name, used for its handle label and the announcements. */
    getLabel: (item: T) => string;
    /** Accessible name of the grid. */
    label: string;
    /** The narrowest a column gets before the grid drops a column, in pixels. */
    minItemWidth?: number;
    disabled?: boolean;
    /** A disabled item keeps its handle inert, so it cannot be picked up; other items can still move past it. */
    isItemDisabled?: (item: T) => boolean;
    className?: string;
}
/** Items in responsive columns that a person puts in order, by dragging an item's grip or from the keyboard in two dimensions. */
export declare function SortableGrid<T>({ items, getKey, onReorder, renderItem, getLabel, label, minItemWidth, disabled, isItemDisabled, className }: SortableGridProps<T>): React.JSX.Element;
