"use client";
import { cn, titleIfClamped } from "../lib/utils.js";
import { Breadcrumb } from "./breadcrumb.js";
import { Button } from "./button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.js";
import { Icon } from "./icon.js";
import page_header_module_default from "./page-header.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/page-header.tsx
function PageHeader({ title, size = "lg", mono = false, breadcrumb, maxItems, badges, description, actions, moreActions, moreLabel = "More actions", tabs, media, truncateTitle = false, className, ref, ...props }) {
	const titleRef = React.useRef(null);
	const [titleClamped, setTitleClamped] = React.useState(false);
	const [titleExpanded, setTitleExpanded] = React.useState(false);
	React.useEffect(() => {
		const element = titleRef.current;
		if (!element || truncateTitle) return;
		const measure = () => {
			const style = getComputedStyle(element);
			const lines = style.display === "inline" ? element.getClientRects().length : element.scrollHeight / parseFloat(style.lineHeight);
			const clamps = style.getPropertyValue("--cipher-page-header-title-clamp").trim() === "2" && lines > 2.5;
			setTitleClamped(clamps);
			if (clamps) element.title = element.textContent ?? "";
			else {
				element.removeAttribute("title");
				setTitleExpanded(false);
			}
		};
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		if (element.parentElement) observer.observe(element.parentElement);
		const mutations = new MutationObserver(measure);
		mutations.observe(element, {
			subtree: true,
			childList: true,
			characterData: true
		});
		document.fonts.addEventListener("loadingdone", measure);
		return () => {
			observer.disconnect();
			mutations.disconnect();
			document.fonts.removeEventListener("loadingdone", measure);
		};
	}, [truncateTitle]);
	const titleToggle = !truncateTitle && titleClamped;
	const more = moreActions && moreActions.length > 0 ? moreActions : null;
	const moreTriggerRef = React.useRef(null);
	const [moreOpen, setMoreOpen] = React.useState(false);
	React.useEffect(() => {
		const trigger = moreTriggerRef.current;
		if (!moreOpen || !trigger) return;
		const observer = new ResizeObserver(() => {
			if (!trigger.getClientRects().length) setMoreOpen(false);
		});
		observer.observe(trigger);
		return () => observer.disconnect();
	}, [moreOpen]);
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
						"data-flow": truncateTitle || titleClamped && !titleExpanded ? void 0 : "inline",
						children: [
							/* @__PURE__ */ jsx("h1", {
								ref: titleRef,
								"data-truncate": truncateTitle || void 0,
								"data-expanded": titleExpanded || void 0,
								"data-clamped": titleClamped || void 0,
								className: cn(page_header_module_default.title, mono && page_header_module_default.mono),
								onPointerEnter: truncateTitle ? (event) => titleIfClamped(event.currentTarget) : void 0,
								children: titleToggle ? /* @__PURE__ */ jsx("span", {
									role: "button",
									tabIndex: 0,
									"aria-expanded": titleExpanded,
									className: page_header_module_default.titleToggle,
									onClick: () => {
										if (window.getSelection()?.isCollapsed !== false) setTitleExpanded(!titleExpanded);
									},
									onKeyDown: (event) => {
										if (event.key !== "Enter" && event.key !== " ") return;
										event.preventDefault();
										setTitleExpanded(!titleExpanded);
									},
									children: title
								}) : title
							}),
							badges && /* @__PURE__ */ jsx("span", {
								className: page_header_module_default.titleGap,
								children: " "
							}),
							badges && /* @__PURE__ */ jsx("span", {
								"data-slot": "page-header-badges",
								className: page_header_module_default.badges,
								children: badges
							})
						]
					}),
					(actions || more) && /* @__PURE__ */ jsxs("div", {
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
						children: [more && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
							"data-slot": "page-header-more-inline",
							className: page_header_module_default.moreInline,
							children: more.map((action) => /* @__PURE__ */ jsx(Button, {
								variant: "outline",
								icon: action.icon,
								disabledReason: action.disabledReason,
								asChild: Boolean(action.href),
								onClick: action.href ? void 0 : action.onSelect,
								children: action.href ? /* @__PURE__ */ jsx("a", {
									href: action.href,
									children: action.label
								}) : action.label
							}, action.label))
						}), /* @__PURE__ */ jsxs(DropdownMenu, {
							open: moreOpen,
							onOpenChange: setMoreOpen,
							children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
								ref: moreTriggerRef,
								asChild: true,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "outline",
									icon: "more",
									iconOnly: true,
									className: page_header_module_default.moreMenu,
									children: moreLabel
								})
							}), /* @__PURE__ */ jsx(DropdownMenuContent, {
								align: "start",
								children: more.map((action) => /* @__PURE__ */ jsx(DropdownMenuItem, {
									variant: action.variant,
									disabledReason: action.disabledReason,
									asChild: Boolean(action.href),
									onSelect: action.href ? void 0 : action.onSelect,
									children: action.href ? /* @__PURE__ */ jsx("a", {
										href: action.href,
										children: action.label
									}) : action.label
								}, action.label))
							})]
						})] }), actions]
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