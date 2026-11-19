import { cn, titleIfClamped } from "../lib/utils.js";
import { Breadcrumb } from "./breadcrumb.js";
import { Icon } from "./icon.js";
import page_header_module_default from "./page-header.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/page-header.tsx
function PageHeader({ title, size = "lg", mono = false, breadcrumb, maxItems, badges, description, actions, tabs, media, truncateTitle = false, className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("header", {
		ref,
		"data-slot": "page-header",
		"data-size": size,
		className: cn(page_header_module_default.header, className),
		...props,
		children: [
			breadcrumb && breadcrumb.length > 0 && /* @__PURE__ */ jsx(Breadcrumb, {
				"aria-label": "Page path",
				items: breadcrumb.map((crumb, index) => index === 0 ? {
					...crumb,
					media: crumb.media ?? /* @__PURE__ */ jsx(Icon, {
						name: "chev-left",
						size: 14
					})
				} : crumb),
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
						className: page_header_module_default.titleLine,
						children: [/* @__PURE__ */ jsx("h1", {
							"data-truncate": truncateTitle || void 0,
							className: cn(page_header_module_default.title, mono && page_header_module_default.mono),
							onPointerEnter: truncateTitle ? (event) => titleIfClamped(event.currentTarget) : void 0,
							children: title
						}), badges && /* @__PURE__ */ jsx("span", {
							"data-slot": "page-header-badges",
							className: page_header_module_default.badges,
							children: badges
						})]
					}),
					actions && /* @__PURE__ */ jsx("div", {
						"data-slot": "page-header-actions",
						className: page_header_module_default.actions,
						onPointerOver: (event) => {
							const button = event.target instanceof Element ? event.target.closest("[data-slot=button]") : null;
							const text = button?.querySelector("[data-slot=button-text]");
							if (!button || !text) return;
							const generated = button.dataset.autoTitle;
							if (generated !== void 0 && button.title !== generated) {
								delete button.dataset.autoTitle;
								return;
							}
							if (button.title && generated === void 0) return;
							if (getComputedStyle(text).position === "absolute") {
								const label = text.textContent ?? "";
								button.title = label;
								button.dataset.autoTitle = label;
							} else if (generated !== void 0) {
								button.removeAttribute("title");
								delete button.dataset.autoTitle;
							}
						},
						children: actions
					}),
					description && /* @__PURE__ */ jsx("div", {
						"data-slot": "page-header-description",
						className: page_header_module_default.description,
						children: description
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