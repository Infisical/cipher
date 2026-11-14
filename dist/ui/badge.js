import { cn } from "../lib/utils.js";
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
function Badge({ className, variant, tone, dot = false, size = "md", mono = false, children, asChild = false, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	const dotNode = dot ? /* @__PURE__ */ jsx("span", {
		"aria-hidden": "true",
		className: helpers_module_default.badgeDot
	}) : null;
	const body = asChild && React.isValidElement(children) ? React.cloneElement(children, void 0, /* @__PURE__ */ jsxs(Fragment, { children: [dotNode, children.props.children] })) : /* @__PURE__ */ jsxs(Fragment, { children: [dotNode, children] });
	return /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-slot": "badge",
		"data-tone": tone ?? (variant ? legacyTone[variant] : "outline"),
		"data-size": size,
		className: cn(badgeVariants(), mono && helpers_module_default.mono, className),
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