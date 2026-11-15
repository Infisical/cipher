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
/** The grip button every sortable surface uses: label it with the item's name, and key it so focus follows the item through a move. */
export declare function SortableHandle({ itemKey, label, instructions, lifted, disabled, onPointerDown, onKeyDown, onBlur }: {
    itemKey: string;
    label: string;
    instructions: string;
    lifted: boolean;
    disabled: boolean;
    onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onBlur: (event: React.FocusEvent) => void;
}): React.JSX.Element;
/** Screen reader instructions for the handles and the live region that announces each move. */
export declare function SortableAnnouncer({ instructions, announcement, children }: {
    instructions: string;
    announcement: string;
    children: React.ReactNode;
}): React.JSX.Element;
export declare function SortableList<T>({ items, getKey, onReorder, renderItem, getLabel, label, variant: requestedVariant, size, disabled, isItemDisabled, className }: SortableListProps<T>): React.JSX.Element;
