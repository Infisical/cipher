"use client";
import { Separator as Separator$1 } from "./separator.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/button-group.tsx
var buttonGroupVariants = cva("group/button-group flex w-fit items-stretch data-[has-group]:gap-2 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1", {
	variants: { orientation: {
		horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none",
		vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none"
	} },
	defaultVariants: { orientation: "horizontal" }
});
var groupFlags = { "data-has-group": ":scope > [data-slot=\"button-group\"]" };
var groupWatch = {
	subtree: false,
	marks: { "data-between-outlines": `:scope > [data-variant="outline"] + .${controls_module_default.groupSeparator}:has(+ [data-variant="outline"])` }
};
function ButtonGroup({ className, orientation = "horizontal", variant = "attached", label, onKeyDown, onFocus, ref, ...props }) {
	const group = React.useRef(null);
	const markRef = useDescendantFlags(groupFlags, groupWatch);
	const controls = () => Array.from(group.current?.querySelectorAll("button:not(:disabled), a[href], [role=\"button\"]:not([aria-disabled=\"true\"])") ?? []);
	React.useLayoutEffect(() => {
		if (variant !== "toolbar") return;
		const nodes = controls();
		const focused = nodes.find((node) => node === document.activeElement) ?? nodes[0];
		nodes.forEach((node) => {
			node.tabIndex = node === focused ? 0 : -1;
		});
	});
	return /* @__PURE__ */ jsx("div", {
		ref: (node) => {
			group.current = node;
			markRef(node);
			if (typeof ref === "function") ref(node);
			else if (ref) {
				const forwarded = ref;
				forwarded.current = node;
			}
		},
		onFocus: (event) => {
			onFocus?.(event);
			if (variant === "toolbar") controls().forEach((node) => {
				node.tabIndex = node === event.target ? 0 : -1;
			});
		},
		onKeyDown: (event) => {
			onKeyDown?.(event);
			if (event.defaultPrevented || variant !== "toolbar" || event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLElement && event.target.closest("input, textarea, select")) return;
			const nodes = controls();
			const index = nodes.findIndex((node) => node === event.target);
			const previous = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
			const next = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
			const target = event.key === "Home" ? nodes[0] : event.key === "End" ? nodes[nodes.length - 1] : event.key === previous ? nodes[(index - 1 + nodes.length) % nodes.length] : event.key === next ? nodes[(index + 1) % nodes.length] : void 0;
			if (target) {
				event.preventDefault();
				target.focus();
			}
		},
		role: variant === "toolbar" ? "toolbar" : "group",
		"aria-label": label,
		"data-variant": variant,
		"data-slot": "button-group",
		"data-orientation": orientation,
		className: cn(variant === "attached" ? buttonGroupVariants({ orientation }) : cn("inline-flex", orientation === "vertical" ? "flex-col items-stretch" : "items-center"), controls_module_default.group, className),
		...props
	});
}
ButtonGroup.displayName = "ButtonGroup";
var labelRuns = (children) => {
	const runs = [];
	let text = "";
	const flush = () => {
		if (text) runs.push(/* @__PURE__ */ jsx("span", {
			className: controls_module_default.groupTextLabel,
			children: text
		}, "text-" + runs.length));
		text = "";
	};
	for (const child of React.Children.toArray(children)) if (typeof child === "string" || typeof child === "number") text += child;
	else {
		flush();
		runs.push(child);
	}
	flush();
	return runs;
};
function ButtonGroupText({ className, asChild = false, size = "default", children, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "div";
	return /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-slot": "button-group-text",
		"data-size": size,
		className: cn(controls_module_default.groupText, className),
		...props,
		children: asChild ? children : labelRuns(children)
	});
}
ButtonGroupText.displayName = "ButtonGroupText";
function ButtonGroupSeparator({ className, orientation = "vertical", ref, ...props }) {
	return /* @__PURE__ */ jsx(Separator$1, {
		ref,
		"data-slot": "button-group-separator",
		orientation,
		className: cn(controls_module_default.groupSeparator, className),
		...props
	});
}
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";
export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants };

//# sourceMappingURL=button-group.js.map