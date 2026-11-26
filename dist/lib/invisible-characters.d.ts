export type InvisibleCharacterSummary = {
    codePoint: string;
    label: string;
    count: number;
};
export type SecretValuePart = {
    text: string;
    isSuspicious: boolean;
};
export declare const isSuspiciousCharacter: (char: string) => boolean;
export declare const splitSuspiciousCharacters: (value: string) => SecretValuePart[];
export declare const getInvisibleCharacterSummary: (value: string) => InvisibleCharacterSummary[];
