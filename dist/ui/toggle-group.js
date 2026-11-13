import { SlidingIndicator } from "../lib/sliding-indicator.js";
import { useMeasuredIndicator } from "../lib/use-measured-indicator.js";
import { toggleVariants } from "./toggle.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ToggleGroup as ToggleGroup$1 } from "radix-ui";
// src/ui/toggle-group.tsx
var ToggleGroupContext = React.createContext({
	size: "default",
	variant: "outline",
	spacing: 0,
	orientation: "horizontal"
});
function ToggleGroup({ className, variant = "outline", size = "default", spacing = 0, orientation = "horizontal", bare = false, width = "content", children, ref, ...props }) {
	const list = React.useRef(null);
	const attach = React.useCallback((node) => {
		list.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	const sliding = props.type === "single" && spacing === 0;
	const { state: indicator } = useMeasuredIndicator({
		listRef: list,
		activeSelector: "[data-slot=\"toggle-group-item\"][data-state=\"on\"]",
		itemSelector: "[data-slot=\"toggle-group-item\"]",
		watch: children,
		enabled: sliding
	});
	return /* @__PURE__ */ jsxs(ToggleGroup$1.Root, {
		ref: attach,
		"data-slot": "toggle-group",
		"data-variant": variant === "default" ? "outline" : variant,
		"data-size": size,
		"data-spacing": spacing,
		"data-bare": bare || void 0,
		"data-width": width,
		"data-indicator": sliding || void 0,
		orientation,
		className: cn(controls_module_default.toggleGroup, className),
		...props,
		style: {
			"--v4-toggle-group-gap": `${spacing * 4}px`,
			...props.style
		},
		children: [sliding && /* @__PURE__ */ jsx(SlidingIndicator, {
			state: indicator,
			className: controls_module_default.indicator
		}), /* @__PURE__ */ jsx(ToggleGroupContext, {
			value: {
				variant,
				size,
				spacing,
				orientation
			},
			children
		})]
	});
}
ToggleGroup.displayName = "ToggleGroup";
function ToggleGroupItem({ className, children, variant = "outline", size = "default", ref, ...props }) {
	const context = React.useContext(ToggleGroupContext);
	const { "data-state": _wrapperState, ...itemProps } = props;
	return /* @__PURE__ */ jsx(ToggleGroup$1.Item, {
		ref,
		"data-variant": (context.variant || variant) === "default" ? "outline" : context.variant || variant,
		"data-size": context.size || size,
		"data-spacing": context.spacing,
		className: cn(toggleVariants({
			variant: context.variant || variant,
			size: context.size || size
		}), className),
		...itemProps,
		"data-slot": "toggle-group-item",
		children: /* @__PURE__ */ jsx("span", {
			"data-press": "",
			children
		})
	});
}
ToggleGroupItem.displayName = "ToggleGroupItem";
export { ToggleGroup, ToggleGroupItem };

//# sourceMappingURL=toggle-group.js.map