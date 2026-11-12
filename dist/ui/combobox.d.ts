import * as React from "react";
import { type OptionCreateHandler } from "../lib/use-option-creation";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command";
import { PopoverContent, PopoverTrigger } from "./popover";
export type ComboboxOption = {
    value: string;
    label: string;
    meta?: string;
    disabled?: boolean;
};
export type ComboboxCreationFormProps = {
    /** The trimmed search text when the row was chosen, for prefilling a name. */
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
};
type SharedComboboxProps = {
    options: readonly ComboboxOption[];
    placeholder?: string;
    label: string;
    id?: string;
    "aria-describedby"?: string;
    emptyText?: string;
    disabled?: boolean;
    invalid?: boolean;
    mono?: boolean;
    defaultOpen?: boolean;
    closeOnFocusOutside?: boolean;
    onCreate?: OptionCreateHandler;
    /** Lets the person empty the value: Clear all after the chips, or Clear selection atop a single list. */
    clearable?: boolean;
    className?: string;
};
export type ComboboxProps = SharedComboboxProps & ({
    multiple?: false;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    onValueChange?: (value: string) => void;
    onSearch?: (query: string) => void;
    loading?: boolean;
    creation?: ComboboxCreation;
} | {
    multiple: true;
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    onValueChange?: (value: string[]) => void;
    onSearch?: never;
    loading?: never;
    creation?: never;
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
