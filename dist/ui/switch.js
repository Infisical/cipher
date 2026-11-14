import { useFieldControlAttributes } from "../lib/field-context.js";
import { snap, spring } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Tooltip as Tooltip$1 } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Switch as Switch$1 } from "radix-ui";
// src/ui/switch.tsx
var thumbGeometry = {
	default: {
		size: 14,
		travel: 16,
		hover: 2,
		press: 4,
		shrink: 2
	},
	sm: {
		size: 10,
		travel: 12,
		hover: 2,
		press: 3,
		shrink: 2
	}
};
function Switch({ className, size = "default", label, description, layout = "default", disabledReason, onChange, onClick, onCheckedChange, onPointerEnter, onPointerLeave, onPointerDown, ref, ...props }) {
	const reduced = useReducedMotion();
	const reason = disabledReason || void 0;
	const inactive = Boolean(props.disabled || reason);
	const [hovered, setHovered] = React.useState(false);
	const [pressed, setPressed] = React.useState(false);
	const [checked, setChecked] = useControllableState({
		value: props.checked,
		defaultValue: props.defaultChecked ?? false
	});
	React.useEffect(() => {
		if (!pressed) return void 0;
		const release = () => setPressed(false);
		window.addEventListener("pointerup", release);
		window.addEventListener("pointercancel", release);
		return () => {
			window.removeEventListener("pointerup", release);
			window.removeEventListener("pointercancel", release);
		};
	}, [pressed]);
	const geometry = thumbGeometry[size];
	const extra = inactive ? 0 : pressed ? geometry.press : hovered ? geometry.hover : 0;
	const shrink = pressed && !inactive ? geometry.shrink : 0;
	const generated = React.useId();
	const titleId = `${generated}-title`;
	const descriptionId = `${generated}-description`;
	const reasonId = `${generated}-reason`;
	const fieldAttributes = useFieldControlAttributes(props);
	const control = /* @__PURE__ */ jsx(Switch$1.Root, {
		ref,
		"data-slot": "switch",
		"data-size": size,
		className: cn("peer group/switch relative inline-flex shrink-0 items-center after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50", controls_module_default.focusOutline, controls_module_default.switch, className),
		...props,
		...fieldAttributes,
		disabled: reason ? void 0 : props.disabled,
		"data-disabled": inactive ? "" : void 0,
		"data-disabled-reason": reason ? "" : void 0,
		"aria-disabled": inactive || void 0,
		id: fieldAttributes.id ?? generated,
		"aria-labelledby": label ? titleId : fieldAttributes["aria-labelledby"],
		"aria-describedby": [
			fieldAttributes["aria-describedby"],
			reason ? reasonId : void 0,
			label && description ? descriptionId : void 0
		].filter(Boolean).join(" ") || void 0,
		onPointerEnter: (event) => {
			if (event.pointerType === "mouse") setHovered(true);
			onPointerEnter?.(event);
		},
		onPointerLeave: (event) => {
			setHovered(false);
			onPointerLeave?.(event);
		},
		onPointerDown: (event) => {
			setPressed(true);
			onPointerDown?.(event);
		},
		onClick: (event) => {
			if (reason) event.preventDefault();
			onClick?.(event);
		},
		onCheckedChange: (next) => {
			setChecked(next);
			onCheckedChange?.(next);
			onChange?.(next === true);
		},
		children: /* @__PURE__ */ jsx(Switch$1.Thumb, {
			asChild: true,
			children: /* @__PURE__ */ jsx(motion.span, {
				"data-slot": "switch-thumb",
				className: cn("pointer-events-none block", controls_module_default.switchThumb),
				initial: false,
				layout: true,
				layoutDependency: `${checked},${extra},${shrink}`,
				style: {
					marginLeft: checked ? geometry.travel - extra : 0,
					width: geometry.size + extra,
					height: geometry.size - shrink
				},
				transition: { layout: reduced ? snap : spring.moderate }
			})
		})
	});
	const anchored = reason ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Tooltip$1, {
		content: reason,
		children: /* @__PURE__ */ jsx("span", {
			"data-slot": "switch-anchor",
			className: controls_module_default.switchAnchor,
			children: control
		})
	}), /* @__PURE__ */ jsx("span", {
		id: reasonId,
		className: "sr-only",
		children: reason
	})] }) : control;
	return label ? /* @__PURE__ */ jsxs("label", {
		htmlFor: fieldAttributes.id ?? generated,
		className: cn(controls_module_default.choice, layout === "row" && controls_module_default.choiceRow),
		children: [
			layout !== "row" && anchored,
			/* @__PURE__ */ jsxs("span", {
				className: controls_module_default.choiceText,
				children: [/* @__PURE__ */ jsx("span", {
					id: titleId,
					className: controls_module_default.choiceTitle,
					children: label
				}), description && /* @__PURE__ */ jsx("span", {
					id: descriptionId,
					className: controls_module_default.choiceDescription,
					children: description
				})]
			}),
			layout === "row" && anchored
		]
	}) : anchored;
}
Switch.displayName = "Switch";
export { Switch };

//# sourceMappingURL=switch.js.map