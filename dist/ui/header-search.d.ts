import * as React from "react";
export type HeaderSearchProps = {
    /** The applied query. With debounceMs it trails the text in the field. A non-empty value puts a dot on the trigger. */
    value: string;
    onValueChange: (value: string) => void;
    /** Accessible name of the trigger and the field, such as "Search email domains". */
    label: string;
    placeholder?: string;
    /** 0 applies every keystroke, for rows filtered in memory. Above 0, a pause of that many milliseconds applies the query, for a server request. */
    debounceMs?: number;
    /** A request for the applied query is in flight. */
    pending?: boolean;
    /** Shown under the field and announced, such as a no-results message. */
    hint?: React.ReactNode;
    /** Where "/" opens the search: while focus is inside the enclosing Card, anywhere on the page, or never. */
    shortcut?: "card" | "page" | false;
    className?: string;
};
/**
 * An icon trigger for a Card's action slot that opens a popover search. It takes the control height of
 * the slot it sits in (the 28px band tier in a framed card's head), so leave its size unset.
 */
export declare function HeaderSearch({ value, onValueChange, label, placeholder, debounceMs, pending, hint, shortcut, className }: HeaderSearchProps): React.JSX.Element;
export declare namespace HeaderSearch {
    var displayName: string;
}
