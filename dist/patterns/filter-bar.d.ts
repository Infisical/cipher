import * as React from "react";
export type FilterBarOption = {
    value: string;
    label: string;
    group?: string;
};
type FilterBarChoiceField = {
    key: string;
    label: string;
    options: readonly FilterBarOption[];
    searchable?: boolean;
};
export type FilterBarField = (FilterBarChoiceField & {
    type: "select";
}) | (FilterBarChoiceField & {
    type: "multi-select";
}) | {
    key: string;
    label: string;
    type: "date";
    defaultMonth?: Date;
} | {
    key: string;
    label: string;
    type: "date-range";
    defaultMonth?: Date;
} | {
    key: string;
    label: string;
    type: "text";
    placeholder?: string;
};
export type FilterBarFilter = {
    field: string;
    operator?: "before" | "after";
    /** ISO dates for date fields: one for date, [from, to] for date-range. */
    values: string[];
};
export type FilterBarProps = {
    label: string;
    /** Leave out for a bar that is only a search box. */
    fields?: readonly FilterBarField[];
    /** Applied filters. Only filters with values arrive here: one just added stays in the bar until its picker closes, and leaves without a change if none was picked. */
    value?: readonly FilterBarFilter[];
    onChange?: (value: FilterBarFilter[]) => void;
    /** Your own search control. Leave out and pass searchValue and onSearchChange for the built-in one. */
    search?: React.ReactNode;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    /** The built-in search's accessible name, and its placeholder unless searchPlaceholder is set. */
    searchLabel?: string;
    searchPlaceholder?: string;
    /** The search stops at size-search-max; fill stretches it across the row up to the filters and actions. */
    width?: "fill";
    actions?: React.ReactNode;
};
export declare const describeFilter: (field: FilterBarField, filter: FilterBarFilter) => {
    verb: string;
    value: string;
};
export declare const FilterBar: ({ label, fields, value: valueProp, onChange, search, searchValue, onSearchChange, searchLabel, searchPlaceholder, width, actions }: FilterBarProps) => React.JSX.Element;
export {};
