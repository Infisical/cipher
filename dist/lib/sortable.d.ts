import * as React from "react";
export declare const moveItem: <T>(list: readonly T[], from: number, to: number) => T[];
export interface SortableLift {
    key: string;
    from: number;
    to: number;
    /** Held by a pointer drag rather than picked up from the keyboard. */
    pointer: boolean;
}
/**
 * The pick-up, move, drop and cancel model every sortable surface shares: Space or Enter picks up and
 * drops, arrow keys move the held item by the delta the surface maps them to, Escape cancels, Tab or
 * blur drops, and Alt with an arrow moves one step without picking up. The item stays in items until
 * the drop, so a surface previews the move from lift and commits through onReorder once.
 */
export declare function useSortable<T>({ items, getKey, getLabel, onReorder }: {
    items: readonly T[];
    getKey: (item: T) => string;
    getLabel: (item: T) => string;
    onReorder: (nextItems: T[]) => void;
}): {
    lift: SortableLift | null;
    liftRef: React.RefObject<SortableLift | null>;
    preview: readonly T[];
    announcement: string;
    instructions: string;
    container: React.RefObject<HTMLElement | null>;
    pick: (item: T, pointer: boolean) => void;
    moveTo: (target: number) => void;
    drop: () => void;
    cancel: () => void;
    keyDown: (event: React.KeyboardEvent, item: T, delta: number) => void;
    blur: (event: React.FocusEvent, item: T) => void;
};
