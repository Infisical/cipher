export type CodeToken = {
    text: string;
    kind: "plain" | "comment" | "string" | "keyword" | "number" | "key";
};
export declare function normalizeCodeLanguage(language: string): string;
export declare function tokenizeCode(text: string, language: string): CodeToken[];
