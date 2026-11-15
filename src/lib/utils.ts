import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
export const truncateTitle = (truncate: boolean, title: string | undefined, children: unknown) =>
  title ??
  (truncate && (typeof children === "string" || typeof children === "number")
    ? String(children)
    : undefined);
