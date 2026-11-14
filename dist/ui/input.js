import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Kbd } from "./kbd.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/input.tsx
var field = `.${controls_module_default.field}`;
/** The state a field box draws from its slotted control or nested field: focus, invalid, disabled and read-only. */
var fieldBoxFlags = {
	"data-control-focus": `[data-field-control]:focus-visible, ${field}:is(:focus-visible, [aria-expanded="true"])`,
	"data-control-invalid": `:is([data-field-control], ${field})[aria-invalid="true"]`,
	"data-control-input-focus": "[data-field-control]:focus-visible",
	"data-control-invalid-focus": `[data-field-control][aria-invalid="true"]:focus-visible, ${field}[aria-invalid="true"]:is(:focus-visible, [aria-expanded="true"])`,
	"data-control-disabled": "[data-field-control]:disabled",
	"data-control-readonly": "[data-field-control][readonly]"
};
var fieldBoxWatch = {
	attributes: [
		"aria-invalid",
		"aria-expanded",
		"disabled",
		"readonly"
	],
	focus: true
};
function Input({ className, type, size = "sm", icon, mono = false, invalid, kbd, trailing, width, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	const inner = React.useRef(null);
	React.useImperativeHandle(ref, () => inner.current);
	const fieldSize = typeof size === "number" ? "sm" : size;
	const leading = icon ?? (props.readOnly ? "lock" : void 0);
	const boxed = Boolean(leading || kbd || trailing);
	const boxRef = useDescendantFlags(fieldBoxFlags, fieldBoxWatch);
	const input = /* @__PURE__ */ jsx("input", {
		ref: inner,
		type,
		"data-slot": "input",
		"data-size": fieldSize,
		"data-field-control": boxed ? "" : void 0,
		"data-width": boxed ? void 0 : width,
		size: typeof size === "number" ? size : void 0,
		className: cn(boxed ? controls_module_default.bare : [controls_module_default.field, "w-full min-w-0"], mono && controls_module_default.mono, className),
		...props,
		...field,
		"aria-invalid": invalid || field["aria-invalid"] || void 0
	});
	return boxed ? /* @__PURE__ */ jsxs("span", {
		ref: boxRef,
		className: cn(controls_module_default.field, controls_module_default.fieldBox),
		"data-size": fieldSize,
		"data-field-box": "",
		"data-width": width,
		"data-trailing": Boolean(kbd || trailing) || void 0,
		onPointerDown: (event) => {
			if (event.target !== event.currentTarget) return;
			event.preventDefault();
			inner.current?.focus();
		},
		children: [
			leading && /* @__PURE__ */ jsx("span", {
				className: controls_module_default.leading,
				children: /* @__PURE__ */ jsx(Icon, { icon: leading })
			}),
			input,
			(kbd || trailing) && /* @__PURE__ */ jsxs("span", {
				className: controls_module_default.trailing,
				children: [kbd && /* @__PURE__ */ jsx(Kbd, { children: kbd }), trailing]
			})
		]
	}) : input;
}
Input.displayName = "Input";
export { Input, fieldBoxFlags, fieldBoxWatch };

//# sourceMappingURL=input.js.map