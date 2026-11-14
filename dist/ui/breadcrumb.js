import { CipherLink } from "../lib/link.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Switcher } from "./switcher.js";
import breadcrumb_module_default from "./breadcrumb.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "radix-ui";
// src/ui/breadcrumb.tsx
var hasPage = (crumb) => Boolean(crumb.link || crumb.href || crumb.onNavigate);
var CrumbName = ({ crumb, className, labelId, children }) => {
	if (crumb.link) return /* @__PURE__ */ jsx(CipherLink, {
		link: crumb.link,
		onClick: crumb.onNavigate,
		"data-slot": "breadcrumb-name",
		className,
		"aria-labelledby": labelId,
		children
	});
	if (crumb.href) return /* @__PURE__ */ jsx("a", {
		href: crumb.href,
		onClick: crumb.onNavigate,
		"data-slot": "breadcrumb-name",
		className,
		"aria-labelledby": labelId,
		children
	});
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick: crumb.onNavigate,
		"data-slot": "breadcrumb-name",
		className,
		"aria-labelledby": labelId,
		children
	});
};
function BandDivider({ className }) {
	return /* @__PURE__ */ jsx("span", {
		"data-slot": "band-divider",
		className: cn(breadcrumb_module_default.separator, className),
		"aria-hidden": "true"
	});
}
BandDivider.displayName = "BandDivider";
var SwitcherCrumb = ({ crumb, current, labelId, purposeId }) => {
	const { switcher } = crumb;
	const [open, setOpen] = useControllableState({
		value: switcher.open,
		defaultValue: switcher.defaultOpen ?? false,
		onChange: switcher.onOpenChange
	});
	const navigates = !current && hasPage(crumb);
	const media = crumb.media && /* @__PURE__ */ jsx("span", {
		className: breadcrumb_module_default.media,
		"aria-hidden": "true",
		children: crumb.media
	});
	const label = /* @__PURE__ */ jsx("span", {
		id: labelId,
		className: cn(breadcrumb_module_default.label, crumb.mono && breadcrumb_module_default.mono),
		title: typeof crumb.label === "string" ? crumb.label : void 0,
		children: crumb.label
	});
	const purpose = /* @__PURE__ */ jsx("span", {
		id: purposeId,
		className: "sr-only",
		children: switcher.label
	});
	if (!navigates) return /* @__PURE__ */ jsx(Switcher, {
		...switcher,
		open,
		onOpenChange: setOpen,
		trigger: /* @__PURE__ */ jsxs("button", {
			type: "button",
			"data-slot": "breadcrumb-switcher",
			"data-name-target": "switcher",
			className: breadcrumb_module_default.segment,
			"aria-current": current ? "page" : void 0,
			"aria-labelledby": `${purposeId} ${labelId}`,
			children: [
				purpose,
				media,
				label,
				/* @__PURE__ */ jsx("span", {
					className: breadcrumb_module_default.chevron,
					"aria-hidden": "true",
					children: /* @__PURE__ */ jsx(Icon, {
						name: "chev-ud",
						size: 14
					})
				})
			]
		})
	});
	return /* @__PURE__ */ jsx(Switcher, {
		...switcher,
		open,
		onOpenChange: setOpen,
		trigger: /* @__PURE__ */ jsxs("button", {
			type: "button",
			"data-slot": "breadcrumb-switcher",
			className: breadcrumb_module_default.chevron,
			"aria-labelledby": `${purposeId} ${labelId}`,
			children: [purpose, /* @__PURE__ */ jsx(Icon, {
				name: "chev-ud",
				size: 14
			})]
		}),
		anchor: (trigger) => /* @__PURE__ */ jsxs("span", {
			className: breadcrumb_module_default.segment,
			"data-name-target": "page",
			children: [/* @__PURE__ */ jsxs(CrumbName, {
				crumb,
				className: breadcrumb_module_default.name,
				labelId,
				children: [media, label]
			}), trigger]
		})
	});
};
function Breadcrumb({ className, items, variant = "default", maxItems, lastIsCurrent = true, children, ref, ...props }) {
	const [expanded, setExpanded] = React.useState(false);
	const nameId = React.useId();
	const collapsible = Boolean(items && maxItems !== void 0 && items.length > Math.max(3, maxItems));
	const renderCrumb = (crumb, index) => {
		const last = lastIsCurrent && index === (items?.length ?? 0) - 1;
		const content = /* @__PURE__ */ jsxs(Fragment, { children: [crumb.media && /* @__PURE__ */ jsx("span", {
			className: breadcrumb_module_default.media,
			children: crumb.media
		}), /* @__PURE__ */ jsx("span", {
			id: `${nameId}-${index}-label`,
			className: cn(breadcrumb_module_default.label, crumb.mono && breadcrumb_module_default.mono),
			title: typeof crumb.label === "string" ? crumb.label : void 0,
			children: crumb.label
		})] });
		return /* @__PURE__ */ jsxs("li", {
			className: breadcrumb_module_default.entry,
			"data-current": last || void 0,
			"data-switcher": Boolean(crumb.switcher) || void 0,
			"data-media": Boolean(crumb.media) || void 0,
			children: [index > 0 && /* @__PURE__ */ jsx(BandDivider, {}), crumb.switcher ? /* @__PURE__ */ jsx(SwitcherCrumb, {
				crumb: {
					...crumb,
					switcher: crumb.switcher
				},
				current: last,
				labelId: `${nameId}-${index}-label`,
				purposeId: `${nameId}-${index}-purpose`
			}) : last ? /* @__PURE__ */ jsx("span", {
				"aria-current": "page",
				className: cn(breadcrumb_module_default.link, breadcrumb_module_default.current, breadcrumb_module_default.static),
				children: content
			}) : hasPage(crumb) ? /* @__PURE__ */ jsx(CrumbName, {
				crumb,
				className: breadcrumb_module_default.link,
				labelId: `${nameId}-${index}-label`,
				children: content
			}) : /* @__PURE__ */ jsx("span", {
				className: cn(breadcrumb_module_default.link, breadcrumb_module_default.static),
				children: content
			})]
		}, index);
	};
	return /* @__PURE__ */ jsx("nav", {
		ref,
		"aria-label": "Breadcrumb",
		"data-slot": "breadcrumb",
		"data-variant": variant,
		className: cn(breadcrumb_module_default.root, className),
		...props,
		children: items ? /* @__PURE__ */ jsx("ol", {
			className: cn(breadcrumb_module_default.trail, variant === "product" && breadcrumb_module_default.product),
			children: items.map((crumb, index) => {
				if (collapsible && index === 1) return /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("li", {
					className: breadcrumb_module_default.entry,
					children: [/* @__PURE__ */ jsx(BandDivider, {}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: breadcrumb_module_default.link,
						"aria-label": expanded ? "Hide middle levels" : `Show ${items.length - 2} middle levels`,
						"aria-expanded": expanded,
						onClick: () => setExpanded(!expanded),
						children: /* @__PURE__ */ jsx(Icon, {
							name: "more",
							className: "size-4"
						})
					})]
				}), expanded && renderCrumb(crumb, index)] }, "middle");
				if (collapsible && index > 1 && index < items.length - 1 && !expanded) return null;
				return renderCrumb(crumb, index);
			})
		}) : children
	});
}
Breadcrumb.displayName = "Breadcrumb";
function BreadcrumbList({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("ol", {
		ref,
		"data-slot": "breadcrumb-list",
		className: cn("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word", className),
		...props
	});
}
BreadcrumbList.displayName = "BreadcrumbList";
function BreadcrumbItem({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		ref,
		"data-slot": "breadcrumb-item",
		className: cn("inline-flex items-center gap-1", className),
		...props
	});
}
BreadcrumbItem.displayName = "BreadcrumbItem";
function BreadcrumbLink({ asChild, className, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "a";
	return /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-slot": "breadcrumb-link",
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
}
BreadcrumbLink.displayName = "BreadcrumbLink";
function BreadcrumbPage({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "breadcrumb-page",
		"aria-current": "page",
		className: cn("font-normal text-foreground", className),
		...props
	});
}
BreadcrumbPage.displayName = "BreadcrumbPage";
function BreadcrumbSeparator({ children, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("li", {
		ref,
		"data-slot": "breadcrumb-separator",
		role: "presentation",
		"aria-hidden": "true",
		className: cn("[&>svg]:size-3.5", className),
		...props,
		children: children ?? /* @__PURE__ */ jsx(BandDivider, {})
	});
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
function BreadcrumbEllipsis({ className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("span", {
		ref,
		"data-slot": "breadcrumb-ellipsis",
		role: "presentation",
		"aria-hidden": "true",
		className: cn("flex size-5 items-center justify-center [&>svg]:size-4", className),
		...props,
		children: [/* @__PURE__ */ jsx(Icon, { name: "more" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "More"
		})]
	});
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
export { BandDivider, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator };

//# sourceMappingURL=breadcrumb.js.map