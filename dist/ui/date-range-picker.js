import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import controls_module_default from "./controls.module.js";
import date_range_picker_module_default from "./date-range-picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/date-range-picker.tsx
var isComplete = (range) => Boolean(range?.from && range.to);
var sameDay = (a, b) => Boolean(a && b && a.toDateString() === b.toDateString());
/** The range after a click: the first click starts a new range even over a complete one, and the second closes it in either direction. */
var pickRange = (range, day) => {
	if (!range?.from || range.to) return {
		from: day,
		to: void 0
	};
	return day < range.from ? {
		from: day,
		to: range.from
	} : {
		from: range.from,
		to: day
	};
};
var defaultFormat = (range, locale) => {
	const format = (date) => date.toLocaleDateString(locale?.code, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	return `${format(range.from)} to ${format(range.to)}`;
};
function DateRangePicker({ value, onValueChange, placeholder = "Choose dates", disabled, numberOfMonths = 1, presets, align = "start", locale, formatRange, className, ...props }) {
	const [open, setOpen] = React.useState(false);
	const [draft, setDraft] = React.useState(value);
	const format = (range) => formatRange?.(range) ?? defaultFormat(range, locale);
	const commit = (next) => {
		onValueChange(next);
		setOpen(false);
	};
	const changeOpen = (next) => {
		if (next) setDraft(value);
		setOpen(next);
	};
	let status = "Choose a start date";
	if (draft?.from && !draft.to) status = "Choose an end date";
	else if (isComplete(draft)) status = format(draft);
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: changeOpen,
		children: [/* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				"data-slot": "date-range-picker",
				variant: "outline",
				layout: "trigger",
				iconRight: "calendar",
				className,
				...props,
				children: isComplete(value) ? format(value) : /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align,
			"data-width": "content",
			"aria-label": "Choose a date range",
			onOpenAutoFocus: (event) => event.preventDefault(),
			children: /* @__PURE__ */ jsxs("div", {
				"data-slot": "date-range-picker-panel",
				className: date_range_picker_module_default.panel,
				children: [presets?.length ? /* @__PURE__ */ jsx("div", {
					role: "group",
					"aria-label": "Presets",
					"data-slot": "date-range-picker-presets",
					className: date_range_picker_module_default.presets,
					children: presets.map((preset) => /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						className: "justify-start",
						"aria-pressed": sameDay(preset.range.from, value?.from) && sameDay(preset.range.to, value?.to),
						onClick: () => commit(preset.range),
						children: preset.label
					}, preset.label))
				}) : null, /* @__PURE__ */ jsxs("div", {
					className: date_range_picker_module_default.main,
					children: [/* @__PURE__ */ jsx(Calendar, {
						mode: "range",
						autoFocus: true,
						"aria-label": "Date range",
						locale,
						numberOfMonths,
						disabled,
						defaultMonth: draft?.from,
						selected: draft,
						onSelect: (_range, day) => {
							const next = pickRange(draft, day);
							setDraft(next);
							if (isComplete(next)) commit(next);
						}
					}), /* @__PURE__ */ jsxs("div", {
						"data-slot": "date-range-picker-footer",
						className: date_range_picker_module_default.footer,
						children: [/* @__PURE__ */ jsx("span", {
							role: "status",
							className: cn(controls_module_default.caption, date_range_picker_module_default.status),
							children: status
						}), value?.from || draft?.from ? /* @__PURE__ */ jsx(Button, {
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
DateRangePicker.displayName = "DateRangePicker";
export { DateRangePicker, pickRange };

//# sourceMappingURL=date-range-picker.js.map