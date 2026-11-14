import { CipherLink } from "../lib/link.js";
import { useCellLink, useStretchedLink } from "../lib/stretched-link.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import row_link_module_default from "./row-link.module.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/row-link.tsx
function RowLink({ className, disabled, chevron = true, title, children, ref, ...props }) {
	const off = disabled ?? props.link.disabled;
	useStretchedLink(!off);
	const content = chevron ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		className: row_link_module_default.label,
		children
	}), /* @__PURE__ */ jsx(Icon, {
		name: "chev-right",
		className: row_link_module_default.chevron,
		"data-row-link-chevron": ""
	})] }) : children;
	if (off) return /* @__PURE__ */ jsx("span", {
		role: "link",
		"aria-disabled": "true",
		title,
		"data-slot": "row-link",
		"data-disabled": "",
		"data-chevron": chevron || void 0,
		className: cn(row_link_module_default.rowLink, className),
		children: content
	});
	return /* @__PURE__ */ jsx(CipherLink, {
		ref,
		title,
		"data-slot": "row-link",
		"data-row-link": "",
		"data-chevron": chevron || void 0,
		className: cn(row_link_module_default.rowLink, row_link_module_default.stretched, className),
		...props,
		children: content
	});
}
/** A link that covers its own table cell rather than the row, such as one plan's price in a matrix. Other cells and a RowLink keep working around it. */
function CellLink({ className, disabled, title, children, ref, ...props }) {
	const off = disabled ?? props.link.disabled;
	useCellLink(!off);
	if (off) return /* @__PURE__ */ jsx("span", {
		role: "link",
		"aria-disabled": "true",
		title,
		"data-slot": "cell-link",
		"data-disabled": "",
		className: cn(row_link_module_default.rowLink, className),
		children
	});
	return /* @__PURE__ */ jsx(CipherLink, {
		ref,
		title,
		"data-slot": "cell-link",
		"data-cell-link": "",
		className: cn(row_link_module_default.rowLink, row_link_module_default.cellLink, className),
		...props,
		children
	});
}
export { CellLink, RowLink };

//# sourceMappingURL=row-link.js.map