"use client";
import { cn } from "../lib/utils.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import { Collapsible as Collapsible$1 } from "radix-ui";
// src/ui/collapsible.tsx
function Collapsible({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Collapsible$1.Root, {
		ref,
		"data-slot": "collapsible",
		...props
	});
}
Collapsible.displayName = "Collapsible";
function CollapsibleTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Collapsible$1.CollapsibleTrigger, {
		ref,
		"data-slot": "collapsible-trigger",
		...props
	});
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";
function CollapsibleContent({ className, onAnimationStart, onAnimationEnd, ref, ...props }) {
	const [animating, setAnimating] = React.useState(false);
	const attach = React.useCallback((node) => {
		if (!node) return void 0;
		const release = typeof ref === "function" ? ref(node) : void 0;
		if (ref && typeof ref !== "function") ref.current = node;
		const cancel = (event) => {
			if (event.target === node) setAnimating(false);
		};
		node.addEventListener("animationcancel", cancel);
		return () => {
			node.removeEventListener("animationcancel", cancel);
			if (typeof release === "function") release();
			else if (typeof ref === "function") ref(null);
			else if (ref) ref.current = null;
		};
	}, [ref]);
	return /* @__PURE__ */ jsx(Collapsible$1.CollapsibleContent, {
		ref: attach,
		"data-slot": "collapsible-content",
		className: cn("duration-(--cipher-duration-moderate) ease-(--cipher-ease-spring) data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down motion-reduce:animate-none!", animating && "overflow-clip", className),
		onAnimationStart: (event) => {
			if (event.target === event.currentTarget) setAnimating(true);
			onAnimationStart?.(event);
		},
		onAnimationEnd: (event) => {
			if (event.target === event.currentTarget) setAnimating(false);
			onAnimationEnd?.(event);
		},
		...props
	});
}
CollapsibleContent.displayName = "CollapsibleContent";
export { Collapsible, CollapsibleContent, CollapsibleTrigger };

//# sourceMappingURL=collapsible.js.map