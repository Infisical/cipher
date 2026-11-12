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
    type: "text";
    placeholder?: string;
};
export type FilterBarFilter = {
    field: string;
    operator?: "before" | "after";
    values: string[];
};
export type FilterBarProps = {
    label: string;
    fields: readonly FilterBarField[];
    value: readonly FilterBarFilter[];
    onChange: (value: FilterBarFilter[]) => void;
    search?: React.ReactNode;
    actions?: React.ReactNode;
};
export declare const describeFilter: (field: FilterBarField, filter: FilterBarFilter) => {
    verb: string;
    value: string;
};
export declare const FilterBar: ({ label, fields, value, onChange, search, actions }: FilterBarProps) => React.JSX.Element;
export {};
