import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** Sets the element's text as its native title while a line clamp or ellipsis cuts it off, and clears it otherwise. */
var titleIfClamped = (element) => {
	if (element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1) element.title = element.textContent ?? "";
	else element.removeAttribute("title");
};
/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
var truncateTitle = (truncate, title, children) => title ?? (truncate && (typeof children === "string" || typeof children === "number") ? String(children) : void 0);
export { cn, titleIfClamped, truncateTitle };

//# sourceMappingURL=utils.js.map