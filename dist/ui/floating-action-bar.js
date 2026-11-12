import { exit, snap, spring } from "../lib/motion.js";
import { cn } from "../lib/utils.js";
import { useV4CollisionBoundary, useV4PortalContainer } from "../scope.js";
import { Button } from "./button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu.js";
import { useActionBarReserve } from "./top-bar.js";
import floating_action_bar_module_default from "./floating-action-bar.module.js";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/floating-action-bar.tsx
var roving = (event, onClear) => {
	if (!event.currentTarget.contains(event.target) || event.defaultPrevented) return;
	if (event.key === "Escape") {
		event.preventDefault();
		event.stopPropagation();
		onClear();
		return;
	}
	if (![
		"ArrowLeft",
		"ArrowRight",
		"Home",
		"End"
	].includes(event.key)) return;
	const buttons = [...event.currentTarget.querySelectorAll("button:not(:disabled)")];
	const index = buttons.indexOf(document.activeElement);
	if (index === -1) return;
	event.preventDefault();
	buttons[event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length]?.focus();
};
var FloatingActionBar = ({ count, total, onSelectAll, actions = [], moreActions = [], onClear, noun = "selected", label = "Bulk actions", className }) => {
	const reduced = useReducedMotion();
	const [lastCount, setLastCount] = React.useState(count);
	const returnFocus = React.useRef(null);
	const bar = React.useRef(null);
	if (count > 0 && count !== lastCount) setLastCount(count);
	const shown = count > 0;
	useActionBarReserve(shown);
	const portal = useV4PortalContainer();
	const boundary = useV4CollisionBoundary();
	React.useEffect(() => {
		if (shown || !bar.current?.contains(document.activeElement)) return;
		returnFocus.current?.focus();
	}, [shown]);
	const visibleCount = shown ? count : lastCount;
	const actionsRef = React.useRef(null);
	const widths = React.useRef(/* @__PURE__ */ new Map());
	const [fit, setFit] = React.useState(actions.length);
	const measure = React.useCallback(() => {
		const node = bar.current;
		const group = actionsRef.current;
		if (!node || !group) return;
		group.querySelectorAll("[data-action-label]").forEach((button) => {
			widths.current.set(button.dataset.actionLabel ?? "", button.offsetWidth);
		});
		const more = group.querySelector("[data-action-more]");
		if (more) widths.current.set("\0more", more.offsetWidth);
		const container = boundary?.clientWidth ?? document.documentElement.clientWidth;
		const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
		const available = Math.min(container - 32, parseFloat(getComputedStyle(node).maxWidth) || Infinity) - (node.offsetWidth - group.offsetWidth);
		if (!actions.every((action) => widths.current.has(action.label))) return;
		const moreWidth = widths.current.get("\0more") ?? 72;
		let next = actions.length;
		const total = (k) => actions.slice(0, k).reduce((sum, action) => sum + (widths.current.get(action.label) ?? 0), 0) + Math.max(0, k - 1 + (k < actions.length || moreActions.length ? 1 : 0)) * gap + (k < actions.length || moreActions.length ? moreWidth : 0);
		while (next > 0 && total(next) > available + .5) next -= 1;
		setFit((current) => current === next ? current : next);
	}, [
		actions,
		moreActions.length,
		boundary
	]);
	const labels = actions.map((action) => action.label).join("\0");
	React.useLayoutEffect(() => {
		setFit(labels ? labels.split("\0").length : 0);
	}, [labels]);
	React.useLayoutEffect(() => {
		if (!shown) return void 0;
		measure();
		const observer = new ResizeObserver(measure);
		if (boundary) observer.observe(boundary);
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	});
	const inline = actions.slice(0, fit);
	const overflow = [...actions.slice(fit), ...moreActions];
	const floating = /* @__PURE__ */ jsx(AnimatePresence, { children: shown && /* @__PURE__ */ jsxs(motion.div, {
		ref: bar,
		"data-slot": "floating-action-bar",
		role: "toolbar",
		"data-v4-escape-owner": "",
		"aria-label": label,
		className: cn(floating_action_bar_module_default.bar, className),
		initial: {
			opacity: 0,
			y: reduced ? 0 : 16
		},
		animate: {
			opacity: 1,
			y: 0,
			transition: reduced ? snap : spring.moderate
		},
		exit: {
			opacity: 0,
			y: reduced ? 0 : 16,
			transition: reduced ? snap : exit.moderate
		},
		onFocus: (event) => {
			const from = event.relatedTarget;
			if (from && !event.currentTarget.contains(from)) returnFocus.current = from;
		},
		onKeyDown: (event) => roving(event, onClear),
		children: [
			/* @__PURE__ */ jsxs("span", {
				className: floating_action_bar_module_default.count,
				role: "status",
				children: [/* @__PURE__ */ jsx("span", {
					className: floating_action_bar_module_default.number,
					children: visibleCount
				}), /* @__PURE__ */ jsx("span", {
					className: floating_action_bar_module_default.noun,
					children: noun
				})]
			}),
			total !== void 0 && onSelectAll && visibleCount < total && /* @__PURE__ */ jsxs(Button, {
				variant: "link",
				size: "sm",
				className: floating_action_bar_module_default.selectAll,
				onClick: onSelectAll,
				children: ["Select all ", total]
			}),
			/* @__PURE__ */ jsx("span", {
				className: floating_action_bar_module_default.rule,
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsxs("span", {
				className: floating_action_bar_module_default.actions,
				ref: actionsRef,
				children: [inline.map((action) => /* @__PURE__ */ jsx(Button, {
					"data-action-label": action.label,
					variant: action.danger ? "danger-ghost" : "ghost",
					size: "sm",
					icon: action.icon,
					disabled: action.disabled,
					disabledReason: action.disabledReason,
					loading: action.loading,
					onClick: action.onClick,
					children: action.label
				}, action.label)), overflow.length > 0 && /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						layout: "trigger",
						"data-action-more": "",
						children: "More"
					})
				}), /* @__PURE__ */ jsx(DropdownMenuContent, {
					side: "top",
					align: "end",
					children: overflow.map((action) => /* @__PURE__ */ jsx(DropdownMenuItem, {
						variant: action.danger ? "destructive" : "default",
						disabled: action.disabled || Boolean(action.disabledReason) || action.loading,
						description: action.disabledReason,
						onSelect: action.onClick,
						children: action.loading ? `${action.label} (running)` : action.label
					}, action.label))
				})] })]
			}),
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "sm",
				onClick: onClear,
				children: "Clear"
			})
		]
	}, "bar") });
	return /* @__PURE__ */ jsxs(Fragment, { children: [shown && /* @__PURE__ */ jsx("span", {
		"data-slot": "floating-action-bar-reserve",
		className: floating_action_bar_module_default.reserve,
		hidden: true
	}), portal ? createPortal(floating, portal) : floating] });
};
export { FloatingActionBar };

//# sourceMappingURL=floating-action-bar.js.map