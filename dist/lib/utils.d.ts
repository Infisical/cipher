import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
export declare const truncateTitle: (truncate: boolean, title: string | undefined, children: unknown) => string | undefined;
