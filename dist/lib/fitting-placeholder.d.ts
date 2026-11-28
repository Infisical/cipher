import * as React from "react";
/** The full placeholder while it fits the field on one line, else the short one, ending in an ellipsis if even that is too long. With truncate off and no short form, the placeholder passes through untouched. */
export declare function useFittingPlaceholder(ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>, placeholder: string | undefined, short: string | undefined, { truncate: truncating }?: {
    truncate?: boolean;
}): string | undefined;
