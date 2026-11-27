import { exit, fade, snap, spring } from "./motion.js";
import { motion, useReducedMotion } from "motion/react";
import { jsx } from "react/jsx-runtime";
// src/lib/sliding-indicator.tsx
/**
* The raised chip behind the selected item. It moves on transforms and size with the moderate
* spring, snaps on the first measure and under reduced motion, and cross-fades instead of travelling.
*/
function SlidingIndicator({ state, className }) {
	const reduced = useReducedMotion();
	const travel = state.instant || reduced ? snap : spring.moderate;
	const appear = state.visible ? fade.enter : exit.moderate;
	return /* @__PURE__ */ jsx(motion.span, {
		"aria-hidden": true,
		className,
		initial: false,
		layout: true,
		layoutDependency: `${state.x},${state.y},${state.width},${state.height}`,
		style: {
			left: state.x,
			top: state.y,
			width: state.width,
			height: state.height
		},
		animate: { opacity: state.visible ? 1 : 0 },
		transition: {
			layout: travel,
			opacity: state.instant ? snap : appear
		}
	});
}
export { SlidingIndicator };

//# sourceMappingURL=sliding-indicator.js.map