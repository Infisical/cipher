import { CipherLink } from "../lib/link.js";
import { cn } from "../lib/utils.js";
import link_module_default from "./link.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/link.tsx
/** An inline text link for prose and help text. Pass link for a route through the app's router, or href for a plain anchor such as an external page. For a link that fills a table cell, use CellLink. */
function Link({ className, underline = "hover", ...props }) {
	const shared = {
		"data-slot": "link",
		"data-underline": underline,
		className: cn(link_module_default.link, className)
	};
	return "link" in props ? /* @__PURE__ */ jsx(CipherLink, {
		...props,
		...shared
	}) : /* @__PURE__ */ jsx("a", {
		...props,
		...shared
	});
}
Link.displayName = "Link";
export { Link };

//# sourceMappingURL=link.js.map