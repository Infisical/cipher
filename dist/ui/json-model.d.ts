export type JsonValue = null | boolean | number | string | JsonValue[] | {
    [key: string]: JsonValue;
};
export type Redaction = readonly string[] | ((key: string) => boolean);
export type JsonNode = {
    start: number;
    end: number;
} & ({
    kind: "scalar";
    raw: string;
} | {
    kind: "array";
    items: JsonNode[];
} | {
    kind: "object";
    entries: {
        key: string;
        node: JsonNode;
    }[];
});
export declare function redactJson(value: JsonValue, redact?: Redaction): JsonValue;
export declare function prepareJson(value: JsonValue, redact?: Redaction): {
    value: JsonValue;
    text: string;
    parsed: boolean;
    document?: JsonNode;
    notice?: string;
};
