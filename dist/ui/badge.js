"use client";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/badge.tsx
var badgeVariants = cva([
	controls_module_default.focusOutline,
	helpers_module_default.badge,
	"group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-(--cipher-badge-glyph)!"
]);
var legacyTone = {
	default: "solid",
	secondary: "soft",
	destructive: "bad",
	outline: "outline",
	ghost: "outline",
	link: "outline"
};
function Badge({ className, variant, tone, dot = false, icon, size = "md", mono = false, collapse = false, children, asChild = false, ref, onPointerEnter, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	const fitsWhole = !icon && !dot;
	const textRef = React.useCallback((label) => {
		const root = label?.parentElement;
		if (!label || !root) return;
		const measure = () => {
			if (fitsWhole && (label.textContent ?? "").length <= 6) root.setAttribute("data-fit", "");
			else root.removeAttribute("data-fit");
		};
		measure();
		const observer = new MutationObserver(measure);
		observer.observe(label, {
			subtree: true,
			childList: true,
			characterData: true
		});
		return () => observer.disconnect();
	}, [fitsWhole]);
	const text = (content) => {
		if (collapse) return /* @__PURE__ */ jsx("span", {
			ref: textRef,
			"data-badge-text": "",
			className: helpers_module_default.badgeText,
			children: content
		});
		const nodes = [];
		let run = [];
		const flush = () => {
			if (!run.length) return;
			nodes.push(/* @__PURE__ */ jsx("span", {
				"data-badge-text": "",
				className: helpers_module_default.badgeText,
				children: run
			}, nodes.length));
			run = [];
		};
		React.Children.toArray(content).forEach((child) => {
			if (React.isValidElement(child) && (child.type === "svg" || child.type !== React.Fragment && child.props.children === void 0)) {
				flush();
				nodes.push(child);
			} else run.push(child);
		});
		flush();
		return nodes;
	};
	const dotNode = /* @__PURE__ */ jsxs(Fragment, { children: [dot && /* @__PURE__ */ jsx("span", {
		"aria-hidden": "true",
		className: helpers_module_default.badgeDot
	}), icon && /* @__PURE__ */ jsx(Icon, { icon })] });
	const body = asChild && React.isValidElement(children) ? React.cloneElement(children, void 0, /* @__PURE__ */ jsxs(Fragment, { children: [dotNode, text(children.props.children)] })) : /* @__PURE__ */ jsxs(Fragment, { children: [dotNode, text(children)] });
	return /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-slot": "badge",
		"data-tone": tone ?? (variant ? legacyTone[variant] : "outline"),
		"data-size": size,
		"data-collapse": collapse || void 0,
		className: cn(badgeVariants(), mono && helpers_module_default.mono, className),
		onPointerEnter: (event) => {
			onPointerEnter?.(event);
			const badge = event.currentTarget;
			const labels = badge.querySelectorAll("[data-badge-text]");
			if (!labels.length) return;
			if (props.title !== void 0) {
				delete badge.dataset.autoTitle;
				return;
			}
			const automatic = badge.dataset.autoTitle !== void 0;
			if (badge.title && !automatic) return;
			const range = document.createRange();
			if (Array.from(labels).some((label) => {
				range.selectNodeContents(label);
				return range.getBoundingClientRect().width > label.getBoundingClientRect().width + .1;
			})) {
				badge.title = (badge.textContent ?? "").trim();
				badge.dataset.autoTitle = "";
			} else if (automatic) {
				badge.removeAttribute("title");
				delete badge.dataset.autoTitle;
			}
		},
		...props,
		children: body
	});
}
Badge.displayName = "Badge";
function Count({ tone = "accent", className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "count",
		"data-tone": tone,
		className: cn(helpers_module_default.count, tone === "ink" && helpers_module_default.countInk, tone === "neutral" && helpers_module_default.countNeutral, className),
		...props
	});
}
Count.displayName = "Count";
export { Badge, Count, badgeVariants };

//# sourceMappingURL=badge.js.map