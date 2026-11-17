"use client";
import { Button } from "./button.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { FieldControlContext, useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { fieldBoxFlags, fieldBoxWatch } from "./input.js";
import button_geometry_module_default from "./button-geometry.module.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
// src/ui/input-group.tsx
var groupFlags = {
	...fieldBoxFlags,
	"data-stacked": "textarea, :scope > [data-align^=\"block-\"]",
	"data-addon-start": ":scope > [data-align=\"inline-start\"]",
	"data-addon-end": ":scope > [data-align=\"inline-end\"]"
};
var groupWatch = {
	...fieldBoxWatch,
	attributes: [...fieldBoxWatch.attributes, "data-align"],
	marks: {
		"data-has-button": ":scope > [data-slot=\"input-group-addon\"]:has([data-cipher-button])",
		"data-has-kbd": ":scope > [data-slot=\"input-group-addon\"]:has(> kbd)"
	}
};
function InputGroup({ className, size = "sm", invalid, ref, ...props }) {
	const field = React.useContext(FieldControlContext);
	const groupRef = useDescendantFlags(groupFlags, groupWatch, ref);
	return /* @__PURE__ */ jsx(FieldControlContext, {
		value: {
			...field,
			"aria-invalid": invalid || field["aria-invalid"]
		},
		children: /* @__PURE__ */ jsx("div", {
			ref: groupRef,
			"data-slot": "input-group",
			"data-field-box": "",
			"data-size": size,
			"data-invalid": invalid || void 0,
			role: "group",
			className: cn("group/input-group relative flex w-full min-w-0 items-center", controls_module_default.field, controls_module_default.inputGroup, button_geometry_module_default.inputGroup, className),
			...props
		})
	});
}
InputGroup.displayName = "InputGroup";
var inputGroupAddonVariants = cva("flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>svg:not([class*='size-'])]:size-4", {
	variants: { align: {
		"inline-start": "order-first pl-2 data-[has-kbd]:ml-[-0.15rem]",
		"inline-end": "order-last pr-2 data-[has-kbd]:mr-[-0.15rem]",
		"block-start": "order-first w-full justify-start px-2.5 pt-2 [.border-b]:pb-2",
		"block-end": "order-last w-full justify-start px-2.5 pb-2 [.border-t]:pt-2"
	} },
	defaultVariants: { align: "inline-start" }
});
function InputGroupAddon({ className, align = "inline-start", ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		role: "group",
		"data-slot": "input-group-addon",
		"data-align": align,
		className: cn(inputGroupAddonVariants({ align }), className),
		...props,
		onClick: (e) => {
			props.onClick?.(e);
			if (e.defaultPrevented || e.target instanceof Element && e.target.closest("button, a, input, textarea, select")) return;
			e.currentTarget.parentElement?.querySelector("input, textarea")?.focus();
		}
	});
}
InputGroupAddon.displayName = "InputGroupAddon";
function InputGroupButton({ className, type = "button", variant = "ghost", size = "xs", ref, ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		ref,
		type,
		"data-slot": "input-group-button",
		size,
		variant,
		className: cn(button_geometry_module_default.nestedAction, "shadow-none", className),
		...props
	});
}
InputGroupButton.displayName = "InputGroupButton";
function InputGroupText({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		className: cn("text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4", className),
		...props
	});
}
InputGroupText.displayName = "InputGroupText";
function InputGroupInput({ className, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	return /* @__PURE__ */ jsx("input", {
		ref,
		"data-slot": "input-group-control",
		"data-field-control": "",
		className: cn(controls_module_default.bare, className),
		...props,
		...field
	});
}
InputGroupInput.displayName = "InputGroupInput";
function InputGroupTextarea({ className, ref, ...props }) {
	const field = useFieldControlAttributes(props);
	return /* @__PURE__ */ jsx("textarea", {
		ref,
		"data-slot": "input-group-control",
		"data-field-control": "",
		className: cn(controls_module_default.bare, controls_module_default.textarea, "resize-none", className),
		...props,
		...field
	});
}
InputGroupTextarea.displayName = "InputGroupTextarea";
export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea };

//# sourceMappingURL=input-group.js.map