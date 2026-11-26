import * as React from "react";
import { type JsonValue, type Redaction } from "./json-model";
export type { JsonValue } from "./json-model";
export { prepareJson, redactJson } from "./json-model";
export type JsonProps = {
    value: JsonValue;
    defaultExpandDepth?: number;
    redact?: Redaction;
    wrap?: boolean;
    maxLines?: number;
    maxHeight?: React.CSSProperties["maxHeight"];
    label?: string;
    className?: string;
    maxDepth?: number;
    maxNodes?: number;
};
export declare const Json: ({ value, redact, defaultExpandDepth, wrap, maxLines, maxHeight, label, className, maxDepth, maxNodes }: JsonProps) => React.JSX.Element;
