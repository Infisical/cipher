"use client";
import { RowDescriptionContext } from "../lib/row-description.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Popover as Popover$1, PopoverContent, PopoverTrigger } from "./popover.js";
import { useReason } from "./tooltip.js";
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
	"group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-(--cipher-badge-glyph)! [&>svg]:[--cipher-lead-size:var(--cipher-badge-glyph)]! [&>svg]:cipher-lead-line"
]);
var legacyTone = {
	default: "solid",
	secondary: "soft",
	destructive: "bad",
	outline: "outline",
	ghost: "outline",
	link: "outline"
};
function Badge({ className, variant, tone, dot = false, icon, media, size = "md", mono = false, collapse = false, reason, children, asChild = false, ref, onPointerEnter, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	const reasonTooltip = useReason(reason);
	const describedBy = reasonTooltip.describedBy([props["aria-describedby"], asChild && React.isValidElement(children) ? children.props["aria-describedby"] : void 0].filter(Boolean).join(" ") || void 0);
	const fitsWhole = !icon && !dot && !media;
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
	const dotNode = /* @__PURE__ */ jsxs(Fragment, { children: [
		dot && /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			className: cn(helpers_module_default.badgeDot, "cipher-lead-line")
		}),
		icon && /* @__PURE__ */ jsx(Icon, { icon }),
		!icon && Boolean(media) && /* @__PURE__ */ jsx("span", {
			"data-slot": "badge-media",
			className: cn(helpers_module_default.badgeMedia, "cipher-lead-line"),
			children: media
		})
	] });
	const body = asChild && React.isValidElement(children) ? React.cloneElement(children, reasonTooltip.active ? { "aria-describedby": describedBy } : void 0, /* @__PURE__ */ jsxs(Fragment, { children: [
		dotNode,
		text(children.props.children),
		reasonTooltip.description
	] })) : /* @__PURE__ */ jsxs(Fragment, { children: [
		dotNode,
		text(children),
		reasonTooltip.description
	] });
	return reasonTooltip.wrap(/* @__PURE__ */ jsx(Comp, {
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
			if (props.title !== void 0 || reasonTooltip.active) {
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
		"aria-describedby": describedBy,
		children: body
	}), true);
}
Badge.displayName = "Badge";
/** A row of badges that never wraps: badges that don't fit collapse into a trailing +N that opens the rest. For table cells, where every row keeps one height. With wrap, every badge shows and they wrap onto more lines, a long label wrapping inside its badge, for a details card or a form where the height can grow. */
function flatten(children, prefix = "") {
	return React.Children.toArray(children).flatMap((child) => {
		if (!React.isValidElement(child)) return [child];
		const key = `${prefix}${child.key}`;
		return child.type === React.Fragment ? flatten(child.props.children, `${key}/`) : [prefix ? React.cloneElement(child, { key }) : child];
	});
}
function BadgeGroup({ className, wrap = false, children, ref, ...props }) {
	const items = flatten(children);
	const groupRef = React.useRef(null);
	const measureRef = React.useRef(null);
	const measured = React.useRef("");
	const [shown, setShown] = React.useState(items.length);
	React.useImperativeHandle(ref, () => groupRef.current);
	React.useLayoutEffect(() => {
		const group = groupRef.current;
		const measure = measureRef.current;
		if (!group || !measure) return;
		const fit = () => {
			const nodes = Array.from(measure.children);
			const more = nodes.pop()?.getBoundingClientRect().width ?? 0;
			const widths = nodes.map((node) => node.getBoundingClientRect().width);
			const signature = widths.join();
			if (signature !== measured.current) {
				measured.current = signature;
				if (visible < widths.length) {
					setShown(widths.length);
					return;
				}
			}
			const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
			const room = group.clientWidth + .5;
			const whole = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
			let used = 0;
			let count = widths.length;
			for (let index = 0; whole > room && index < widths.length; index++) {
				used += (index ? gap : 0) + widths[index];
				const tail = index < widths.length - 1 ? gap + more : 0;
				if (used + tail > room) {
					count = Math.max(1, index);
					break;
				}
			}
			setShown(count);
		};
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(group);
		Array.from(measure.children).forEach((node) => observer.observe(node));
		return () => observer.disconnect();
	});
	const visible = wrap ? items.length : Math.min(shown, items.length);
	const rest = items.length - visible;
	return /* @__PURE__ */ jsxs("div", {
		ref: groupRef,
		"data-slot": "badge-group",
		"data-wrap": wrap || void 0,
		className: cn(helpers_module_default.badgeGroup, className),
		...props,
		children: [
			items.slice(0, visible),
			rest > 0 && /* @__PURE__ */ jsxs(Popover$1, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Badge, {
					asChild: true,
					children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						"aria-label": `${rest} more`,
						onClick: (event) => event.stopPropagation(),
						children: ["+", rest]
					})
				})
			}), /* @__PURE__ */ jsx(PopoverContent, {
				align: "start",
				"data-width": "content",
				onClick: (event) => event.stopPropagation(),
				children: /* @__PURE__ */ jsx("div", {
					className: helpers_module_default.badgeGroupMore,
					children: items.slice(visible)
				})
			})] }),
			!wrap && /* @__PURE__ */ jsx("div", {
				ref: measureRef,
				"aria-hidden": "true",
				inert: true,
				className: helpers_module_default.badgeGroupMeasure,
				children: /* @__PURE__ */ jsxs(RowDescriptionContext, {
					value: null,
					children: [items.map((item) => React.isValidElement(item) ? React.cloneElement(item, {
						ref: null,
						id: void 0
					}) : item), /* @__PURE__ */ jsxs(Badge, { children: ["+", items.length] })]
				})
			})
		]
	});
}
BadgeGroup.displayName = "BadgeGroup";
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
/** A title followed by its count, as List and Heading show it. A number or string becomes the accent Count. */
function TitleCount({ count, wrap = false, children }) {
	return /* @__PURE__ */ jsxs("span", {
		"data-slot": "title-count",
		"data-wrap": wrap || void 0,
		className: helpers_module_default.titleCount,
		children: [/* @__PURE__ */ jsx("span", { children }), typeof count === "number" || typeof count === "string" ? /* @__PURE__ */ jsx(Count, { children: count }) : count]
	});
}
TitleCount.displayName = "TitleCount";
export { Badge, BadgeGroup, Count, TitleCount, badgeVariants };

//# sourceMappingURL=badge.js.map