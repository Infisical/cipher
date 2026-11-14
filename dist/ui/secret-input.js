"use client";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { getInvisibleCharacterSummary } from "../lib/invisible-characters.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";
import { fieldBoxFlags, fieldBoxWatch } from "./input.js";
import button_geometry_module_default from "./button-geometry.module.js";
import controls_module_default from "./controls.module.js";
import secret_input_module_default from "./secret-input.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/secret-input.tsx
var HIDDEN_SECRET_VALUE = "••••••••••••••••";
function SecretInput({ value, onChange, multiline = false, invalid, className, onFocus, onBlur, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	const [focused, setFocused] = React.useState(false);
	const warningId = React.useId();
	const invisible = React.useMemo(() => getInvisibleCharacterSummary(value), [value]);
	const masked = !focused && value !== "";
	const boxRef = useDescendantFlags(fieldBoxFlags, fieldBoxWatch);
	const labelled = Boolean(props["aria-label"] || field.id || field["aria-labelledby"]);
	return /* @__PURE__ */ jsxs("span", {
		ref: boxRef,
		"data-slot": "secret-input",
		"data-field-box": "",
		"data-trailing": invisible.length > 0 || void 0,
		"data-size": "sm",
		"data-multiline": multiline || void 0,
		"data-masked": masked || void 0,
		className: cn(controls_module_default.field, controls_module_default.fieldBox, secret_input_module_default.box, className),
		children: [/* @__PURE__ */ jsx("textarea", {
			ref,
			"data-field-control": "",
			rows: multiline ? 3 : 1,
			spellCheck: false,
			autoComplete: "off",
			"aria-label": labelled ? void 0 : "Secret value",
			className: cn(controls_module_default.bare, secret_input_module_default.text),
			...props,
			...field,
			"aria-invalid": invalid || field["aria-invalid"] || void 0,
			"aria-describedby": [field["aria-describedby"], invisible.length > 0 ? warningId : void 0].filter(Boolean).join(" ") || void 0,
			value: masked ? HIDDEN_SECRET_VALUE : value,
			onChange: (event) => onChange(event.target.value),
			onFocus: (event) => {
				setFocused(true);
				onFocus?.(event);
			},
			onBlur: (event) => {
				setFocused(false);
				onBlur?.(event);
			}
		}), invisible.length > 0 && /* @__PURE__ */ jsxs("span", {
			className: controls_module_default.trailing,
			children: [/* @__PURE__ */ jsx("span", {
				id: warningId,
				className: "sr-only",
				children: "Contains invisible characters"
			}), /* @__PURE__ */ jsxs(HoverCard, {
				openDelay: 200,
				children: [/* @__PURE__ */ jsx(HoverCardTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "ghost",
						iconOnly: true,
						icon: "alert",
						className: cn(button_geometry_module_default.nestedAction, secret_input_module_default.warning),
						children: "Value contains invisible characters"
					})
				}), /* @__PURE__ */ jsxs(HoverCardContent, {
					align: "end",
					children: [/* @__PURE__ */ jsx("span", {
						className: secret_input_module_default.warningLine,
						children: "This value contains invisible characters that can break it when used:"
					}), invisible.map(({ codePoint, label, count }) => /* @__PURE__ */ jsxs("span", {
						className: secret_input_module_default.warningLine,
						children: [
							count,
							"x ",
							label,
							" (",
							codePoint,
							")"
						]
					}, codePoint))]
				})]
			})]
		})]
	});
}
export { HIDDEN_SECRET_VALUE, SecretInput };

//# sourceMappingURL=secret-input.js.map