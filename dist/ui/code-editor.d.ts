import * as React from "react";
export type CodeEditorDialect = "postgres" | "cockroachdb" | "mysql" | "snowflake" | "clickhouse";
export type CodeEditorHandle = {
    focus: () => void;
};
export type CodeEditorProps = Omit<React.ComponentPropsWithoutRef<"div">, "children" | "defaultValue" | "onChange"> & {
    value: string;
    onChange?: (value: string) => void;
    /** The SQL engine whose keywords, types, quoting and comments are highlighted. */
    dialect?: CodeEditorDialect;
    /** Mod+Enter. Receives the selected text, or the whole query when nothing is selected. */
    onRun?: (query: string) => void;
    /** The selected text after every selection change, empty when nothing is selected. */
    onSelectionChange?: (selected: string) => void;
    placeholder?: string;
    readOnly?: boolean;
    invalid?: boolean;
    /** Edits that would make the query longer than this many characters are refused. */
    maxLength?: number;
    /** Lines shown before the editor grows. Set a height with className to scroll instead. */
    rows?: number;
    ref?: React.Ref<CodeEditorHandle>;
};
export declare function CodeEditor({ value, onChange, dialect, onRun, onSelectionChange, placeholder, readOnly, invalid, maxLength, rows, className, style, ref, id, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, "aria-invalid": ariaInvalidProp, ...props }: CodeEditorProps): React.JSX.Element;
export declare namespace CodeEditor {
    var displayName: string;
}
