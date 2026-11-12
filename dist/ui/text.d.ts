import * as React from "react";
import { type IconName } from "./icon";
export declare function Text({ muted, className, ref, ...props }: React.ComponentPropsWithoutRef<"p"> & {
    muted?: boolean;
} & {
    ref?: React.Ref<HTMLParagraphElement>;
}): React.JSX.Element;
export declare namespace Text {
    var displayName: string;
}
export declare function SmallText({ muted, className, ref, ...props }: React.ComponentPropsWithoutRef<"p"> & {
    muted?: boolean;
} & {
    ref?: React.Ref<HTMLParagraphElement>;
}): React.JSX.Element;
export declare namespace SmallText {
    var displayName: string;
}
export declare function Heading({ level, size, className, ref, ...props }: React.ComponentPropsWithoutRef<"h2"> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    size?: "page" | "display" | "section" | "subsection";
} & {
    ref?: React.Ref<HTMLHeadingElement>;
}): React.JSX.Element;
export declare namespace Heading {
    var displayName: string;
}
export declare function Meta({ mono, className, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    mono?: boolean;
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Meta {
    var displayName: string;
}
export declare function StatusText({ tone, icon, loading, className, children, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    tone?: "neutral" | "ok" | "warn" | "bad";
} & ({
    icon: IconName;
    loading?: boolean;
} | {
    icon?: IconName;
    loading: true;
}) & {
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
