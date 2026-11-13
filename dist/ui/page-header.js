import { cn } from "../lib/utils.js";
import { Breadcrumb } from "./breadcrumb.js";
import page_header_module_default from "./page-header.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/page-header.tsx
function PageHeader({ title, size = "lg", mono = false, breadcrumb, maxItems, badges, description, actions, tabs, media, className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("header", {
		ref,
		"data-slot": "page-header",
		"data-size": size,
		className: cn(page_header_module_default.header, className),
		...props,
		children: [
			breadcrumb && breadcrumb.length > 0 && /* @__PURE__ */ jsx(Breadcrumb, {
				"aria-label": "Page path",
				items: breadcrumb,
				maxItems,
				lastIsCurrent: false,
				className: page_header_module_default.trail
			}),
			/* @__PURE__ */ jsxs("div", {
				className: page_header_module_default.main,
				children: [
					media && /* @__PURE__ */ jsx("span", {
						className: page_header_module_default.media,
						children: media
					}),
					/* @__PURE__ */ jsxs("div", {
						className: page_header_module_default.copy,
						children: [/* @__PURE__ */ jsxs("div", {
							className: page_header_module_default.titleLine,
							children: [/* @__PURE__ */ jsx("h1", {
								className: cn(page_header_module_default.title, mono && page_header_module_default.mono),
								children: title
							}), badges && /* @__PURE__ */ jsx("span", {
								className: page_header_module_default.badges,
								children: badges
							})]
						}), description && /* @__PURE__ */ jsx("p", {
							className: page_header_module_default.description,
							children: description
						})]
					}),
					actions && /* @__PURE__ */ jsx("div", {
						className: page_header_module_default.actions,
						children: actions
					})
				]
			}),
			tabs && /* @__PURE__ */ jsx("div", {
				className: page_header_module_default.tabs,
				children: tabs
			})
		]
	});
}
PageHeader.displayName = "PageHeader";
export { PageHeader };

//# sourceMappingURL=page-header.js.map