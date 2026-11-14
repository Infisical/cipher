import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { Popover as Popover$1, PopoverContent, PopoverTrigger } from "./popover.js";
import color_picker_module_default from "./color-picker.module.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { RadioGroup } from "radix-ui";
// src/ui/color-picker.tsx
var tagColorPresets = [
	{
		name: "Gray",
		value: "#bec2c8"
	},
	{
		name: "Blue",
		value: "#95a2b3"
	},
	{
		name: "Purple",
		value: "#5e6ad2"
	},
	{
		name: "Teal",
		value: "#26b5ce"
	},
	{
		name: "Green",
		value: "#4cb782"
	},
	{
		name: "Yellow",
		value: "#f2c94c"
	},
	{
		name: "Orange",
		value: "#f2994a"
	},
	{
		name: "Pink",
		value: "#f7c8c1"
	},
	{
		name: "Red",
		value: "#eb5757"
	}
];
var hexColor = /^#[0-9a-f]{6}$/i;
var swatchStyle = (color) => hexColor.test(color) ? { "--cipher-color-picker-value": color } : void 0;
function ColorPicker({ value, onChange, presets, disabled, readOnly, placeholder = "#000000", ...props }) {
	const [open, setOpen] = React.useState(false);
	const locked = Boolean(disabled || readOnly);
	const preset = presets?.find((entry) => entry.value.toLowerCase() === value.toLowerCase());
	const swatch = /* @__PURE__ */ jsx("span", {
		"data-slot": "color-picker-swatch",
		"data-empty": hexColor.test(value) ? void 0 : "",
		className: color_picker_module_default.swatch,
		style: swatchStyle(value),
		"aria-hidden": true
	});
	return /* @__PURE__ */ jsx(Input, {
		...props,
		mono: true,
		autoComplete: "off",
		spellCheck: false,
		value,
		placeholder,
		disabled,
		readOnly,
		onChange: (event) => onChange(event.target.value),
		trailing: presets?.length ? /* @__PURE__ */ jsxs(Popover$1, {
			open: open && !locked,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ jsx(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					size: "icon-sm",
					"aria-label": preset ? `Preset colors, ${preset.name} selected` : "Preset colors",
					disabled: locked,
					children: swatch
				})
			}), /* @__PURE__ */ jsx(PopoverContent, {
				align: "end",
				"data-width": "content",
				children: /* @__PURE__ */ jsx(RadioGroup.Root, {
					"aria-label": "Preset colors",
					"data-slot": "color-picker-palette",
					className: color_picker_module_default.palette,
					value: preset?.value ?? "",
					disabled: locked,
					onValueChange: (next) => {
						if (!locked) onChange(next);
					},
					children: presets.map((entry) => /* @__PURE__ */ jsx(RadioGroup.Item, {
						value: entry.value,
						"aria-label": entry.name,
						"data-slot": "color-picker-option",
						className: cn(color_picker_module_default.option, controls_module_default.focusOutline),
						style: swatchStyle(entry.value),
						onClick: (event) => {
							if (event.detail > 0) setOpen(false);
						}
					}, entry.value))
				})
			})]
		}) : swatch
	});
}
ColorPicker.displayName = "ColorPicker";
export { ColorPicker, tagColorPresets };

//# sourceMappingURL=color-picker.js.map