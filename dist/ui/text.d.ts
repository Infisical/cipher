import * as React from "react";
import { type IconSource } from "./icon";
type TextProps = React.ComponentPropsWithoutRef<"p"> & {
    muted?: boolean;
    /** Keeps the line breaks and spaces in user-entered text, such as notes, and still wraps long lines. */
    preWrap?: boolean;
    /** Keeps the text on one line and ends it in an ellipsis, with a string child as its title. */
    truncate?: boolean;
} & {
    ref?: React.Ref<HTMLParagraphElement>;
};
export declare function Text({ muted, preWrap, truncate, title, className, ref, ...props }: TextProps): React.JSX.Element;
export declare namespace Text {
    var displayName: string;
}
export declare function SmallText({ muted, preWrap, truncate, title, className, ref, ...props }: TextProps): React.JSX.Element;
export declare namespace SmallText {
    var displayName: string;
}
export declare function Heading({ level, size, count, className, children, ref, ...props }: React.ComponentPropsWithoutRef<"h2"> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    size?: "page" | "display" | "section" | "subsection";
    /** Shown right after the title, as List's countPlacement="title" shows it. A number or string becomes the accent Count. */
    count?: React.ReactNode;
} & {
    ref?: React.Ref<HTMLHeadingElement>;
}): React.JSX.Element;
export declare namespace Heading {
    var displayName: string;
}
export declare function Meta({ mono, truncate, title, className, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    mono?: boolean;
    truncate?: boolean;
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Meta {
    var displayName: string;
}
export declare function StatusText({ tone, size, icon, loading, className, children, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    tone?: "neutral" | "ok" | "warn" | "bad";
    /** sm sets small text and md body text; without it the status inherits the surrounding type, so set it inside a Heading or a stat value. */
    size?: "sm" | "md";
    icon?: IconSource;
    loading?: boolean;
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace StatusText {
    var displayName: string;
}
/**
 * Marks every case-insensitive occurrence of query in text as a search match. The query is literal
 * text, never a pattern; terms matches each whitespace-separated word on its own.
 */
export declare function Highlight({ text, query, terms, className }: {
    text: string;
    query?: string;
    terms?: boolean;
    className?: string;
}): string | React.ReactNode[];
export {};
