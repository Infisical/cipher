import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import controls_module_default from "./controls.module.js";
import date_picker_module_default from "./date-picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/date-picker.tsx
var sameDay = (a, b) => Boolean(a && b && a.toDateString() === b.toDateString());
function DatePicker({ value, onValueChange, placeholder = "Choose a date", disabled, presets, align = "start", locale, formatDate, className, ...props }) {
	const [open, setOpen] = React.useState(false);
	const field = useFieldControlAttributes(props);
	const generatedId = React.useId();
	const id = field.id ?? generatedId;
	const format = (date) => formatDate?.(date) ?? date.toLocaleDateString(locale?.code, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	const commit = (next) => {
		onValueChange(next);
		setOpen(false);
	};
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				"data-slot": "date-picker",
				variant: "outline",
				layout: "trigger",
				iconRight: "calendar",
				className,
				...props,
				...field,
				id,
				"aria-labelledby": field["aria-labelledby"] && `${field["aria-labelledby"]} ${id}`,
				children: value ? format(value) : /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align,
			"data-width": "content",
			"aria-label": "Choose a date",
			onOpenAutoFocus: (event) => event.preventDefault(),
			children: /* @__PURE__ */ jsxs("div", {
				"data-slot": "date-picker-panel",
				className: date_picker_module_default.panel,
				children: [presets?.length ? /* @__PURE__ */ jsx("div", {
					role: "group",
					"aria-label": "Presets",
					"data-slot": "date-picker-presets",
					className: date_picker_module_default.presets,
					children: presets.map((preset) => /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						className: "justify-start",
						"aria-pressed": sameDay(preset.date, value),
						onClick: () => commit(preset.date),
						children: preset.label
					}, preset.label))
				}) : null, /* @__PURE__ */ jsxs("div", {
					className: date_picker_module_default.main,
					children: [/* @__PURE__ */ jsx(Calendar, {
						mode: "single",
						required: true,
						autoFocus: true,
						"aria-label": "Date",
						locale,
						disabled,
						defaultMonth: value,
						selected: value,
						onSelect: commit
					}), /* @__PURE__ */ jsxs("div", {
						"data-slot": "date-picker-footer",
						className: date_picker_module_default.footer,
						children: [/* @__PURE__ */ jsx("span", {
							role: "status",
							className: cn(controls_module_default.caption, date_picker_module_default.status),
							children: value ? format(value) : "Choose a date"
						}), value ? /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "xs",
							onClick: () => commit(void 0),
							children: "Clear"
						}) : null]
					})]
				})]
			})
		})]
	});
}
DatePicker.displayName = "DatePicker";
export { DatePicker };

//# sourceMappingURL=date-picker.js.map