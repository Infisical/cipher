import { CipherLink } from "../lib/link.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { DropdownMenu as DropdownMenu$1, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.js";
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
var CrumbNavigation = ({ crumb, children }) => {
	if (crumb.link) return /* @__PURE__ */ jsx(DropdownMenuItem, {
		asChild: true,
		children: /* @__PURE__ */ jsx(CipherLink, {
			link: crumb.link,
			onClick: crumb.onNavigate,
			children
		})
	});
	if (crumb.href) return /* @__PURE__ */ jsx(DropdownMenuItem, {
		asChild: true,
		children: /* @__PURE__ */ jsx("a", {
			href: crumb.href,
			onClick: crumb.onNavigate,
			children
		})
	});
	return /* @__PURE__ */ jsx(DropdownMenuItem, {
		onClick: crumb.onNavigate,
		children
	});
};
var RulerCrumb = ({ crumb, current }) => {
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [crumb.media && /* @__PURE__ */ jsx("span", {
		className: breadcrumb_module_default.media,
		children: crumb.media
	}), /* @__PURE__ */ jsx("span", {
		className: cn(breadcrumb_module_default.label, crumb.mono && breadcrumb_module_default.mono),
		children: crumb.label
	})] });
	if (crumb.switcher && !current && hasPage(crumb)) return /* @__PURE__ */ jsxs("span", {
		className: breadcrumb_module_default.segment,
		"data-name-target": "page",
		children: [/* @__PURE__ */ jsx("span", {
			className: breadcrumb_module_default.name,
			children: content
		}), /* @__PURE__ */ jsx("span", { className: breadcrumb_module_default.chevron })]
	});
	if (crumb.switcher || current && crumb.menu) return /* @__PURE__ */ jsxs("span", {
		className: breadcrumb_module_default.segment,
		"data-name-target": "switcher",
		children: [content, /* @__PURE__ */ jsx("span", { className: breadcrumb_module_default.chevron })]
	});
	return /* @__PURE__ */ jsx("span", {
		className: cn(breadcrumb_module_default.link, current && breadcrumb_module_default.current),
		children: content
	});
};
var lastHiddenCrumb = (entries, ellipsis, container, maxItems, head) => {
	const count = entries.length;
	const cap = maxItems === void 0 ? count : Math.max(head + 1, maxItems);
	const total = entries.reduce((sum, width) => sum + width, 0);
	if (count - 2 < head || count <= cap && total <= container) return -1;
	let first = count - 1;
	let used = entries.slice(0, head).reduce((sum, width) => sum + width, 0) + entries[count - 1] + ellipsis;
	while (first - 1 > head && head + count - first + 1 <= cap && used + entries[first - 1] <= container) {
		first -= 1;
		used += entries[first];
	}
	return first - 1;
};
function Breadcrumb({ className, items, variant = "default", maxItems, lastIsCurrent = true, trailingDivider = false, children, ref, ...props }) {
	const nameId = React.useId();
	const nav = React.useRef(null);
	const measure = React.useRef(null);
	const [lastHidden, setLastHidden] = React.useState(-1);
	const count = items?.length ?? 0;
	const measured = variant === "default" && count > 2;
	const head = 1 + (items ?? []).reduce((last, crumb, index) => crumb.switcher && index < count - 1 ? index : last, 0);
	const attach = React.useCallback((node) => {
		nav.current = node;
		if (typeof ref === "function") return ref(node);
		if (ref) ref.current = node;
	}, [ref]);
	React.useLayoutEffect(() => {
		const root = nav.current;
		const list = measure.current;
		if (!measured || !root || !list) {
			setLastHidden(-1);
			return;
		}
		let active = true;
		const read = () => {
			if (!active) return;
			const entries = [...list.querySelectorAll("[data-measure=\"entry\"]")].map((entry) => entry.getBoundingClientRect().width);
			const ellipsis = list.querySelector("[data-measure=\"ellipsis\"]")?.getBoundingClientRect().width ?? 0;
			setLastHidden(lastHiddenCrumb(entries, ellipsis, root.clientWidth, maxItems, head));
		};
		read();
		const observer = new ResizeObserver(read);
		observer.observe(root);
		list.querySelectorAll("[data-measure]").forEach((entry) => observer.observe(entry));
		document.fonts?.ready.then(read).catch(() => {});
		return () => {
			active = false;
			observer.disconnect();
		};
	}, [
		measured,
		count,
		maxItems,
		head
	]);
	const hiddenTo = measured ? lastHidden : maxItems !== void 0 && count > Math.max(3, maxItems) && count - 2 >= head ? count - 2 : -1;
	const hiddenCount = hiddenTo < 0 ? 0 : hiddenTo - head + 1;
	const ids = (index) => ({
		label: nameId + "-" + index + "-label",
		purpose: nameId + "-" + index + "-purpose"
	});
	const renderCrumb = (crumb, index) => {
		const last = lastIsCurrent && index === count - 1;
		const content = /* @__PURE__ */ jsxs(Fragment, { children: [crumb.media && /* @__PURE__ */ jsx("span", {
			className: breadcrumb_module_default.media,
			children: crumb.media
		}), /* @__PURE__ */ jsx("span", {
			id: ids(index).label,
			className: cn(breadcrumb_module_default.label, crumb.mono && breadcrumb_module_default.mono),
			title: typeof crumb.label === "string" ? crumb.label : void 0,
			children: crumb.label
		})] });
		return /* @__PURE__ */ jsxs("li", {
			className: breadcrumb_module_default.entry,
			"data-current": last || void 0,
			"data-switcher": Boolean(crumb.switcher) || void 0,
			"data-media": Boolean(crumb.media) || void 0,
			children: [
				index > 0 && /* @__PURE__ */ jsx(BandDivider, {}),
				crumb.switcher ? /* @__PURE__ */ jsx(SwitcherCrumb, {
					crumb: {
						...crumb,
						switcher: crumb.switcher
					},
					current: last,
					labelId: ids(index).label,
					purposeId: ids(index).purpose
				}) : last && crumb.menu ? /* @__PURE__ */ jsxs(DropdownMenu$1, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						"data-slot": "breadcrumb-menu",
						"data-name-target": "switcher",
						className: breadcrumb_module_default.segment,
						"aria-current": "page",
						"aria-labelledby": ids(index).purpose + " " + ids(index).label,
						children: [
							/* @__PURE__ */ jsx("span", {
								id: ids(index).purpose,
								className: "sr-only",
								children: "Actions for"
							}),
							content,
							/* @__PURE__ */ jsx("span", {
								className: breadcrumb_module_default.chevron,
								"aria-hidden": "true",
								children: /* @__PURE__ */ jsx(Icon, {
									name: "chev-down",
									size: 14
								})
							})
						]
					})
				}), /* @__PURE__ */ jsx(DropdownMenuContent, {
					align: "start",
					children: crumb.menu
				})] }) : last ? /* @__PURE__ */ jsx("span", {
					"aria-current": "page",
					className: cn(breadcrumb_module_default.link, breadcrumb_module_default.current, breadcrumb_module_default.static),
					children: content
				}) : hasPage(crumb) ? /* @__PURE__ */ jsx(CrumbName, {
					crumb,
					className: breadcrumb_module_default.link,
					labelId: ids(index).label,
					children: content
				}) : /* @__PURE__ */ jsx("span", {
					className: cn(breadcrumb_module_default.link, breadcrumb_module_default.static),
					children: content
				}),
				trailingDivider && count === 1 && /* @__PURE__ */ jsx(BandDivider, {})
			]
		}, index);
	};
	const trailClass = cn(breadcrumb_module_default.trail, variant === "product" && breadcrumb_module_default.product);
	return /* @__PURE__ */ jsx("nav", {
		ref: attach,
		"aria-label": "Breadcrumb",
		"data-slot": "breadcrumb",
		"data-variant": variant,
		className: cn(breadcrumb_module_default.root, className),
		...props,
		children: items ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("ol", {
			className: trailClass,
			children: items.map((crumb, index) => {
				if (index < head || index > hiddenTo) return renderCrumb(crumb, index);
				if (index > head) return null;
				return /* @__PURE__ */ jsxs("li", {
					className: breadcrumb_module_default.entry,
					children: [/* @__PURE__ */ jsx(BandDivider, {}), /* @__PURE__ */ jsxs(DropdownMenu$1, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx("button", {
							type: "button",
							"data-slot": "breadcrumb-ellipsis",
							className: breadcrumb_module_default.chevron,
							"aria-label": "Show " + hiddenCount + " hidden levels",
							children: /* @__PURE__ */ jsx(Icon, {
								name: "more",
								size: 16
							})
						})
					}), /* @__PURE__ */ jsx(DropdownMenuContent, {
						align: "start",
						className: breadcrumb_module_default.hiddenMenu,
						children: items.slice(head, hiddenTo + 1).map((hiddenCrumb, offset) => /* @__PURE__ */ jsxs(CrumbNavigation, {
							crumb: hiddenCrumb,
							children: [hiddenCrumb.media ?? /* @__PURE__ */ jsx(Icon, { name: "folder" }), /* @__PURE__ */ jsx("span", {
								className: breadcrumb_module_default.label,
								children: hiddenCrumb.label
							})]
						}, offset))
					})] })]
				}, "hidden");
			})
		}), measured && /* @__PURE__ */ jsx("div", {
			className: breadcrumb_module_default.measure,
			"aria-hidden": "true",
			children: /* @__PURE__ */ jsxs("ol", {
				ref: measure,
				className: trailClass,
				children: [items.map((crumb, index) => /* @__PURE__ */ jsxs("li", {
					className: breadcrumb_module_default.entry,
					"data-measure": "entry",
					children: [index > 0 && /* @__PURE__ */ jsx(BandDivider, {}), /* @__PURE__ */ jsx(RulerCrumb, {
						crumb,
						current: lastIsCurrent && index === count - 1
					})]
				}, index)), /* @__PURE__ */ jsxs("li", {
					className: breadcrumb_module_default.entry,
					"data-measure": "ellipsis",
					children: [/* @__PURE__ */ jsx(BandDivider, {}), /* @__PURE__ */ jsx("span", { className: breadcrumb_module_default.chevron })]
				})]
			})
		})] }) : children
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