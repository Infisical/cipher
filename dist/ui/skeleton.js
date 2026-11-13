import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/skeleton.tsx
function Skeleton({ className, width, height, lines, style, ref, ...props }) {
	if (lines) return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "skeleton-lines",
		"aria-hidden": "true",
		className: "flex flex-col gap-2",
		style: {
			width,
			...style
		},
		...props,
		children: Array.from({ length: Math.min(100, Math.max(1, Math.floor(lines))) }, (_, index) => /* @__PURE__ */ jsx(Skeleton, {
			height,
			width: index === lines - 1 && lines > 1 ? "60%" : "100%",
			className
		}, index))
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "skeleton",
		"aria-hidden": "true",
		style: {
			width,
			height: height ?? "var(--v4-size-skeleton-text)",
			...style
		},
		className: cn(controls_module_default.skeleton, "animate-pulse bg-[color:var(--v4-line-soft)] motion-reduce:animate-none", className),
		...props
	});
}
Skeleton.displayName = "Skeleton";
export { Skeleton };

//# sourceMappingURL=skeleton.js.map