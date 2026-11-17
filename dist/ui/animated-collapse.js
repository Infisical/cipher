import { exit, fade, motionMs, snap, spring } from "../lib/motion.js";
import { cn } from "../lib/utils.js";
import text_module_default from "./text.module.js";
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { jsx } from "react/jsx-runtime";
// src/ui/animated-collapse.tsx
var stackGap = (node) => {
	const parent = node?.parentElement;
	if (!node?.previousElementSibling || !parent) return 0;
	const layout = getComputedStyle(parent);
	return layout.display.includes("grid") || layout.display.includes("flex") && layout.flexDirection.startsWith("column") ? parseFloat(layout.rowGap) || 0 : 0;
};
function AnimatedCollapse({ open, lazy = false, children, className, style, ref, ...props }) {
	const own = React.useRef(null);
	const [gap, setGap] = React.useState(0);
	const [present, setPresent] = React.useState(open);
	const [mounted, setMounted] = React.useState(!lazy || open);
	const [expanded, setExpanded] = React.useState(open);
	React.useEffect(() => {
		setGap(stackGap(own.current));
		const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		if (open) {
			setMounted(true);
			setPresent(true);
			if (reducedMotion) {
				setExpanded(true);
				return;
			}
			const frame = requestAnimationFrame(() => setExpanded(true));
			return () => cancelAnimationFrame(frame);
		}
		setExpanded(false);
		if (reducedMotion) {
			setPresent(false);
			return;
		}
		const timer = window.setTimeout(() => setPresent(false), motionMs.exit.moderate);
		return () => window.clearTimeout(timer);
	}, [open]);
	const reduced = useReducedMotion();
	const [settled, setSettled] = React.useState(open);
	React.useEffect(() => {
		if (!expanded) setSettled(false);
	}, [expanded]);
	const travel = reduced ? snap : expanded ? spring.moderate : exit.moderate;
	return /* @__PURE__ */ jsx(motion.div, {
		ref: (node) => {
			own.current = node;
			if (typeof ref === "function") ref(node);
			else if (ref) ref.current = node;
		},
		"data-slot": "animated-collapse",
		"data-open": expanded || void 0,
		className: cn(text_module_default.collapse, className),
		hidden: !present && !open,
		"aria-hidden": !open || void 0,
		...!open ? { inert: true } : {},
		initial: false,
		animate: {
			height: expanded ? "auto" : 0,
			marginBlockStart: expanded ? 0 : -gap
		},
		transition: travel,
		onAnimationComplete: () => {
			if (expanded) setSettled(true);
		},
		style: {
			...style,
			overflow: settled ? "visible" : "hidden"
		},
		...props,
		children: /* @__PURE__ */ jsx(motion.div, {
			className: text_module_default.collapseInner,
			initial: false,
			animate: { opacity: expanded ? 1 : 0 },
			transition: expanded ? fade.enter : exit.fast,
			children: (!lazy || mounted || open) && children
		})
	});
}
AnimatedCollapse.displayName = "AnimatedCollapse";
export { AnimatedCollapse };

//# sourceMappingURL=animated-collapse.js.map