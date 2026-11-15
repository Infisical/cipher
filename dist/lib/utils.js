import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
/** The hover title for end-truncated content: the caller's title, else the content when it is plain text. */
var truncateTitle = (truncate, title, children) => title ?? (truncate && (typeof children === "string" || typeof children === "number") ? String(children) : void 0);
export { cn, truncateTitle };

//# sourceMappingURL=utils.js.map