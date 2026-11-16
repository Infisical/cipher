import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Sets the element's text as its native title while a line clamp or ellipsis cuts it off, and clears it otherwise. */
export const titleIfClamped = (element: HTMLElement) => {
  const cut =
    element.scrollHeight > element.clientHeight + 1 ||
    element.scrollWidth > element.clientWidth + 1;
  if (cut) element.title = element.textContent ?? "";
  else element.removeAttribute("title");
};

/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
export const truncateTitle = (truncate: boolean, title: string | undefined, children: unknown) =>
  title ??
  (truncate && (typeof children === "string" || typeof children === "number")
    ? String(children)
    : undefined);
