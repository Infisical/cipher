import * as React from "react";
import { type OptionCreateHandler } from "../lib/use-option-creation";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command";
import { type IconSource } from "./icon";
import { type FieldWidth } from "./input";
import { MultiSelectFooterAction } from "./multi-select";
import { PopoverContent, PopoverTrigger } from "./popover";
export type ComboboxOption = {
    value: string;
    label: string;
    /** A glyph at the row's start, also shown in the trigger while this option is selected. Single selection only. */
    icon?: IconSource;
    /** A logo or image at the row's start, sized like an icon, also shown in the trigger or chip while this option is selected. It never shrinks; the label truncates first. Ignored when icon is set. */
    media?: React.ReactNode;
    /** A muted line under the label. Search matches it as well as the label. */
    description?: string;
    meta?: string;
    /** A Badge after the label, in the row and, for single selection, in the trigger while this option is selected. */
    badge?: React.ReactNode;
    /** Options that share a group sit under its heading, in the order each group first appears. Search matches the heading too. */
    group?: string;
    /** Extra words search matches but never shows, such as a product's other names or an ID. */
    keywords?: readonly string[];
    disabled?: boolean;
};
export type ComboboxCreationFormProps = {
    /** Always empty: the dialog opens blank rather than copying the search text into a field. */
    query: string;
    /** Give the form element this id; the dialog's submit button targets it. */
    formId: string;
    /** Select the created option and close the dialog. Ignored once the dialog was dismissed. */
    complete: (option: ComboboxOption) => void;
    /** Close the dialog, asking first when the form reported unsaved changes. */
    dismiss: () => void;
    onDirtyChange: (dirty: boolean) => void;
    onPendingChange: (pending: boolean) => void;
    /** Relabel the submit button while this form is open; undefined goes back to submitLabel. */
    onSubmitLabelChange: (label: string | undefined) => void;
};
export type ComboboxCreation = {
    mode: "inline";
    onCreate: OptionCreateHandler;
    /** Keeps the Create row visible but disabled, with this reason beside it. */
    disabledReason?: string;
} | {
    mode: "dialog";
    /** The row label, for example Create connection. */
    label: string;
    title: string;
    description?: string;
    submitLabel?: string;
    renderForm: (props: ComboboxCreationFormProps) => React.ReactNode;
    /** Keeps the Create row visible but disabled, with this reason beside it. */
    disabledReason?: string;
    discardTitle?: string;
    discardDescription?: string;
} | {
    /** Shows the Create row and hands over to your own flow, such as a MultiStep dialog. */
    mode: "action";
    label: string;
    /** query is the trimmed search text; complete selects the created option. */
    onSelect: (props: {
        query: string;
        complete: (option: ComboboxOption) => void;
    }) => void;
    disabledReason?: string;
};
type SharedComboboxProps = {
    options: readonly ComboboxOption[];
    placeholder?: string;
    label: string;
    id?: string;
    "aria-describedby"?: string;
    /** Shown when there are no options at all. Defaults to "No options found". */
    emptyText?: string;
    /** Pinned under the list, such as a note that results are capped or a link to manage the options. A string renders as a muted caption. It stays out of arrow-key navigation, so its controls are reached with Tab. */
    footer?: React.ReactNode;
    /** Shown when options exist but the search matches none. With onSearch, any query that returns nothing. Defaults to "No options found". */
    noMatchText?: string;
    /** The search field's placeholder. Defaults to "Search options". */
    searchPlaceholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    mono?: boolean;
    defaultOpen?: boolean;
    closeOnFocusOutside?: boolean;
    onCreate?: OptionCreateHandler;
    /** The inline Create row's text for the trimmed search, for example (query) => `Create category "${query}"`. */
    createLabel?: (query: string) => string;
    /** While options are loading: a spinner in the search field, and Searching… in place of the empty text. Selected chips stay visible and removable. */
    loading?: boolean;
    /** Shows a clear X in place of the chevron while the value holds something the person can remove. Locked (disabled) options stay selected. */
    clearable?: boolean;
    /** The clear X's accessible name, for example Remove usage cap. Defaults to Clear selection, or Clear all selections with multiple. */
    clearLabel?: string;
    /** A fixed token width that doesn't shrink. Unset fills the row. */
    width?: FieldWidth;
    align?: "start" | "center" | "end";
    className?: string;
};
export type ComboboxProps = SharedComboboxProps & ({
    multiple?: false;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onValueChange?: (value: string) => void;
    onSearch?: (query: string) => void;
    creation?: ComboboxCreation;
} | {
    multiple: true;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    onValueChange?: (value: string[]) => void;
    /** Searches on the server: called with each query (and with "" when the menu closes), while options holds the results as they arrive. Chips keep the labels of options seen earlier, so include the initially selected options in options on first render. */
    onSearch?: (query: string) => void;
    /** Only the action mode: a Create row pinned under the list, visible before anything is typed. */
    creation?: Extract<ComboboxCreation, {
        mode: "action";
    }>;
});
export declare function Combobox({ ref, ...props }: ComboboxProps & {
    ref?: React.Ref<HTMLButtonElement>;
}): React.JSX.Element;
export declare namespace Combobox {
    var displayName: string;
}
export declare const ComboboxInput: typeof CommandInput;
export declare const ComboboxContent: typeof PopoverContent;
export declare const ComboboxTrigger: typeof PopoverTrigger;
export declare const ComboboxList: typeof CommandList;
export declare const ComboboxItem: typeof CommandItem;
export declare const ComboboxEmpty: typeof CommandEmpty;
export declare const ComboboxGroup: typeof CommandGroup;
export declare const ComboboxSeparator: typeof CommandSeparator;
export declare function ComboboxLabel({ ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace ComboboxLabel {
    var displayName: string;
}
export declare const ComboboxValue: typeof ComboboxLabel;
export declare const ComboboxCollection: React.ExoticComponent<React.FragmentProps>;
export declare const ComboboxFooterAction: typeof MultiSelectFooterAction;
export declare function ComboboxChips({ ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace ComboboxChips {
    var displayName: string;
}
export declare function ComboboxChip({ ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace ComboboxChip {
    var displayName: string;
}
export declare const ComboboxChipsInput: typeof CommandInput;
export declare const useComboboxAnchor: () => React.RefObject<HTMLDivElement | null>;
export {};
