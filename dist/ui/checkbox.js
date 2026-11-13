import { useFieldControlAttributes } from "../lib/field-context.js";
import { exit, fade, motionMs } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { motion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Checkbox as Checkbox$1 } from "radix-ui";
// src/ui/checkbox.tsx
function Checkbox({ className, label, description, media, indeterminate, onChange, onCheckedChange, ref, ...props }) {
	const generated = React.useId();
	const titleId = `${generated}-title`;
	const descriptionId = `${generated}-description`;
	const fieldAttributes = useFieldControlAttributes(props);
	const [checked, setChecked] = useControllableState({
		value: props.checked,
		defaultValue: props.defaultChecked ?? false
	});
	const drawn = checked === true && !indeterminate;
	const control = /* @__PURE__ */ jsx(Checkbox$1.Root, {
		ref,
		"data-slot": "checkbox",
		className: cn("peer relative flex shrink-0 items-center justify-center group-data-[has-disabled]/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50", controls_module_default.focusOutline, controls_module_default.choiceMark, controls_module_default.check, className),
		...props,
		...fieldAttributes,
		id: fieldAttributes.id ?? generated,
		"aria-labelledby": label ? titleId : fieldAttributes["aria-labelledby"],
		"aria-describedby": [fieldAttributes["aria-describedby"], label && description ? descriptionId : void 0].filter(Boolean).join(" ") || void 0,
		onCheckedChange: (next) => {
			setChecked(next);
			onCheckedChange?.(next);
			onChange?.(next === true);
		},
		checked: indeterminate ? "indeterminate" : props.checked,
		children: /* @__PURE__ */ jsxs(Checkbox$1.Indicator, {
			forceMount: true,
			"data-slot": "checkbox-indicator",
			className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
			children: [/* @__PURE__ */ jsx(motion.span, {
				"data-check": true,
				"aria-hidden": true,
				className: "grid place-content-center [&>svg]:size-3.5",
				initial: false,
				animate: {
					clipPath: drawn ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
					opacity: drawn ? 1 : 0
				},
				transition: {
					clipPath: drawn ? fade.enter : exit.fast,
					opacity: {
						duration: 0,
						delay: drawn ? 0 : motionMs.exit.fast / 1e3
					}
				},
				children: /* @__PURE__ */ jsx(Icon, {
					name: "check",
					strokeWidth: 2
				})
			}), /* @__PURE__ */ jsx(Icon, {
				name: "minus",
				"data-mixed": "",
				strokeWidth: 2
			})]
		})
	});
	return label ? /* @__PURE__ */ jsxs("label", {
		htmlFor: fieldAttributes.id ?? generated,
		className: controls_module_default.choice,
		children: [
			control,
			media && /* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				className: controls_module_default.choiceMedia,
				children: media
			}),
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
			})
		]
	}) : control;
}
Checkbox.displayName = "Checkbox";
export { Checkbox };

//# sourceMappingURL=checkbox.js.map