import * as React from "react";
import { type OptionCreateHandler } from "../lib/use-option-creation";
import { type IconSource } from "./icon";
export type MultiSelectOption = {
    value: string;
    label: string;
    /** A muted line under the label. Search matches it as well as the label. */
    description?: string;
    /** A short muted value at the row's end, such as a count. */
    meta?: string;
    /** A glyph at the row's start. */
    icon?: IconSource;
    /** A logo or image at the row's start, sized like an icon, such as an app connection's logo. Ignored when icon is set. */
    media?: React.ReactNode;
    disabled?: boolean;
    /** Search matches the group's heading too. */
    group?: string;
    /** Extra words the search matches but never shows, such as an ID or an alias. */
    keywords?: readonly string[];
};
export type MultiSelectCreateAction = {
    /** The row's text, for example Create connection. */
    label: string;
    /** Closes the menu and hands over to your own flow. query is the trimmed search text; complete selects the option it made, which you add to options too. */
    onSelect: (props: {
        query: string;
        complete: (option: MultiSelectOption) => void;
    }) => void;
    /** Keeps the row visible but disabled, with this reason beside it. */
    disabledReason?: string;
};
type Shared = {
    onCreate?: OptionCreateHandler;
    /** A Create row at the end of the list that starts your own flow, such as a dialog that makes a connection. */
    createAction?: MultiSelectCreateAction;
    /** The Create row's text for the trimmed search, for example (query) => `Create tag "${query}"`. */
    createLabel?: (query: string) => string;
    onEmptyBackspace?: () => void;
    options: readonly MultiSelectOption[];
    label: string;
    id?: string;
    "aria-describedby"?: string;
    placeholder?: string;
    allLabel?: string;
    disabled?: boolean;
    invalid?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Searches on the server: called with each query (and with "" when the menu closes), while options holds the results as they arrive. It turns on the search field. Include the selected options in options on first render so their labels show. */
    onSearch?: (query: string) => void;
    /** While onSearch is in flight: a spinner in the search field, and Searching… in place of No options found. */
    loading?: boolean;
    anchorRef?: React.RefObject<HTMLElement | null>;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    renderValue?: (selected: readonly MultiSelectOption[]) => React.ReactNode;
    trigger?: React.ReactElement<React.ButtonHTMLAttributes<HTMLElement>>;
    size?: "sm" | "md";
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    menuWidth?: React.CSSProperties["width"];
    quickActions?: boolean;
    closeOnFocusOutside?: boolean;
    className?: string;
};
export type MultiSelectProps = Shared & ({
    multiple?: true;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
} | {
    multiple: false;
    value?: string | null;
    defaultValue?: string | null;
    onChange?: (value: string | null) => void;
});
export declare function MultiSelect({ ref, ...props }: MultiSelectProps & {
    ref?: React.Ref<HTMLButtonElement>;
}): React.JSX.Element;
export declare namespace MultiSelect {
    var displayName: string;
}
export {};
