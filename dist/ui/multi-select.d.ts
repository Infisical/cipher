import * as React from "react";
import { type OptionCreateHandler } from "../lib/use-option-creation";
export type MultiSelectOption = {
    value: string;
    label: string;
    /** A muted line under the label. Search matches it as well as the label. */
    description?: string;
    /** A short muted value at the row's end, such as a count. */
    meta?: string;
    disabled?: boolean;
    group?: string;
};
type Shared = {
    onCreate?: OptionCreateHandler;
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
