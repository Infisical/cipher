"use client";
import { exit, spring } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { RadioGroup as RadioGroup$1 } from "radix-ui";
// src/ui/radio-group.tsx
var RadioValueContext = React.createContext(void 0);
function RadioGroup({ className, value, defaultValue, onValueChange, ref, ...props }) {
	const [current, setCurrent] = useControllableState({
		value: value ?? void 0,
		defaultValue: defaultValue ?? void 0,
		onChange: (next) => next !== void 0 && onValueChange?.(next)
	});
	return /* @__PURE__ */ jsx(RadioValueContext, {
		value: current,
		children: /* @__PURE__ */ jsx(RadioGroup$1.Root, {
			ref,
			"data-slot": "radio-group",
			className: cn(controls_module_default.radioGroup, "grid w-full gap-2", className),
			value,
			defaultValue,
			onValueChange: (next) => {
				setCurrent(next);
			},
			...props
		})
	});
}
RadioGroup.displayName = "RadioGroup";
function RadioGroupItem({ className, ref, ...props }) {
	const reduced = useReducedMotion();
	const selected = React.useContext(RadioValueContext) === props.value;
	return /* @__PURE__ */ jsx(RadioGroup$1.Item, {
		ref,
		"data-slot": "radio-group-item",
		className: cn("group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50", controls_module_default.focusOutline, controls_module_default.choiceMark, className),
		...props,
		children: /* @__PURE__ */ jsx(RadioGroup$1.Indicator, {
			forceMount: true,
			"data-slot": "radio-group-indicator",
			className: "flex size-4 items-center justify-center",
			children: /* @__PURE__ */ jsx(motion.span, {
				className: controls_module_default.radioDot,
				initial: false,
				animate: {
					scale: selected || reduced ? 1 : .3,
					opacity: selected ? 1 : 0
				},
				transition: selected ? spring.fast : exit.fast
			})
		})
	});
}
RadioGroupItem.displayName = "RadioGroupItem";
function RadioGroupCard({ className, title, description, media, ref, ...props }) {
	const reduced = useReducedMotion();
	const selected = React.useContext(RadioValueContext) === props.value;
	const generated = React.useId();
	const titleId = `${generated}-title`;
	const descriptionId = `${generated}-description`;
	return /* @__PURE__ */ jsxs(RadioGroup$1.Item, {
		ref,
		"data-slot": "radio-group-card",
		"aria-labelledby": titleId,
		"aria-describedby": description ? descriptionId : void 0,
		className: cn("disabled:cursor-not-allowed disabled:opacity-50", controls_module_default.choiceCard, controls_module_default.focusOutline, className),
		...props,
		children: [/* @__PURE__ */ jsx("span", {
			className: controls_module_default.choiceCardMarkBox,
			children: /* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				"data-state": selected ? "checked" : "unchecked",
				className: cn(controls_module_default.choiceMark, controls_module_default.choiceCardMark),
				children: /* @__PURE__ */ jsx(motion.span, {
					className: controls_module_default.radioDot,
					initial: false,
					animate: {
						scale: selected || reduced ? 1 : .3,
						opacity: selected ? 1 : 0
					},
					transition: selected ? spring.fast : exit.fast
				})
			})
		}), /* @__PURE__ */ jsxs("span", {
			className: controls_module_default.choiceText,
			children: [/* @__PURE__ */ jsxs("span", {
				className: controls_module_default.choiceCardHead,
				children: [media && /* @__PURE__ */ jsx("span", {
					"aria-hidden": true,
					className: controls_module_default.choiceCardMedia,
					children: media
				}), /* @__PURE__ */ jsx("span", {
					id: titleId,
					className: controls_module_default.choiceTitle,
					children: title
				})]
			}), description && /* @__PURE__ */ jsx("span", {
				id: descriptionId,
				className: controls_module_default.choiceDescription,
				children: description
			})]
		})]
	});
}
RadioGroupCard.displayName = "RadioGroupCard";
export { RadioGroup, RadioGroupCard, RadioGroupItem };

//# sourceMappingURL=radio-group.js.map