"use client";
import { cn } from "../lib/utils.js";
import button_geometry_module_default from "./button-geometry.module.js";
import button_material_module_default from "./button-material.module.js";
import controls_module_default from "./controls.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { Toggle as Toggle$1 } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/toggle.tsx
var toggleVariants = cva([
	button_geometry_module_default.button,
	controls_module_default.focusOutline,
	controls_module_default.toggle,
	button_material_module_default.paintTransition,
	button_material_module_default.neutralSelection,
	"group/toggle inline-flex items-center justify-center whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0"
], {
	variants: {
		variant: {
			outline: controls_module_default.toggleOutline,
			default: controls_module_default.toggleOutline,
			ghost: controls_module_default.toggleGhost
		},
		size: {
			default: button_geometry_module_default.default,
			sm: button_geometry_module_default.default,
			md: button_geometry_module_default.regular,
			lg: button_geometry_module_default.large
		}
	},
	defaultVariants: {
		variant: "outline",
		size: "default"
	}
});
function Toggle({ className, variant = "outline", size = "default", children, ref, ...props }) {
	const { "data-state": _wrapperState, ...toggleProps } = props;
	return /* @__PURE__ */ jsx(Toggle$1.Root, {
		ref,
		"data-variant": variant === "default" ? "outline" : variant,
		"data-size": size,
		className: cn(toggleVariants({
			variant,
			size,
			className
		})),
		...toggleProps,
		"data-slot": "toggle",
		children: /* @__PURE__ */ jsx("span", {
			"data-press": "",
			children
		})
	});
}
Toggle.displayName = "Toggle";
export { Toggle, toggleVariants };

//# sourceMappingURL=toggle.js.map