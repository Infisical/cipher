import { cn } from "../lib/utils.js";
import detail_module_default from "./detail.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/detail.tsx
function Detail({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("dl", {
		ref,
		"data-slot": "detail",
		className: cn(detail_module_default.detail, className),
		...props
	});
}
function DetailLabel({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("dt", {
		ref,
		"data-slot": "detail-label",
		className: cn(detail_module_default.label, className),
		...props
	});
}
function DetailValue({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("dd", {
		ref,
		"data-slot": "detail-value",
		className: cn(detail_module_default.value, className),
		...props
	});
}
function DetailGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "detail-group",
		className: cn(detail_module_default.group, className),
		...props
	});
}
function DetailGroupHeader({ className, level = 3, action, children, ref, ...props }) {
	const Heading = `h${level}`;
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "detail-group-header",
		className: cn(detail_module_default.header, className),
		...props,
		children: [/* @__PURE__ */ jsx(Heading, {
			className: detail_module_default.title,
			children
		}), action && /* @__PURE__ */ jsx("div", {
			className: detail_module_default.action,
			children: action
		})]
	});
}
export { Detail, DetailGroup, DetailGroupHeader, DetailLabel, DetailValue };

//# sourceMappingURL=detail.js.map