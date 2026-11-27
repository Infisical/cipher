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
export declare const EMPTY_VALUE = "\u2014";
/** The placeholder for a value that isn't set, such as an empty table cell or a token with no expiry. Screen readers hear the label instead of the dash. */
export declare function EmptyValue({ label, className, ref, ...props }: Omit<React.ComponentPropsWithoutRef<"span">, "children"> & {
    label?: string;
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace EmptyValue {
    var displayName: string;
}
/** A compact uppercase group label, such as WHEN or CONDITIONS above a block of rules. */
export declare function Eyebrow({ className, ref, ...props }: React.ComponentPropsWithoutRef<"p"> & {
    ref?: React.Ref<HTMLParagraphElement>;
}): React.JSX.Element;
export declare namespace Eyebrow {
    var displayName: string;
}
export declare function StatusText({ tone, size, icon, loading, reason, className, children, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    tone?: "neutral" | "ok" | "warn" | "bad";
    /** sm sets small text and md body text; without it the status inherits the surrounding type, so set it inside a Heading or a stat value. */
    size?: "sm" | "md";
    icon?: IconSource;
    loading?: boolean;
    /** Says why, such as the error behind a failed status: the text becomes a tab stop, shows the reason in a tooltip and exposes it as the accessible description. */
    reason?: React.ReactNode;
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
