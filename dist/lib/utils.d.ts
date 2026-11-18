import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
/** Sets the element's text as its native title while a line clamp or ellipsis cuts it off, and clears it otherwise. */
export declare const titleIfClamped: (element: HTMLElement) => void;
/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
export declare const truncateTitle: (truncate: boolean, title: string | undefined, children: unknown) => string | undefined;
