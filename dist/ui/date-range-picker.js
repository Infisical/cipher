import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import controls_module_default from "./controls.module.js";
import date_picker_module_default from "./date-picker.module.js";
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
function DateRangePicker({ value, onValueChange, placeholder = "Choose dates", disabled, numberOfMonths = 1, presets, commit: commitMode = numberOfMonths > 1 || presets?.length ? "apply" : "immediate", align = "start", locale, formatRange, className, ...props }) {
	const [open, setOpen] = React.useState(false);
	const [draft, setDraft] = React.useState(value);
	const [month, setMonth] = React.useState(() => value?.from ?? /* @__PURE__ */ new Date());
	const field = useFieldControlAttributes(props);
	const generatedId = React.useId();
	const id = field.id ?? generatedId;
	const apply = commitMode === "apply";
	const format = (range) => formatRange?.(range) ?? defaultFormat(range, locale);
	const commit = (next) => {
		onValueChange(next);
		setOpen(false);
	};
	const changeOpen = (next) => {
		if (next) {
			setDraft(value);
			setMonth(value?.from ?? /* @__PURE__ */ new Date());
		}
		setOpen(next);
	};
	const choosePreset = (range) => {
		if (!apply) return commit(range);
		setDraft(range);
		if (range.from) setMonth(range.from);
	};
	const shown = apply ? draft : value;
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
				...field,
				id,
				"aria-labelledby": field["aria-labelledby"] && `${field["aria-labelledby"]} ${id}`,
				children: isComplete(value) ? format(value) : /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align,
			"data-width": numberOfMonths > 1 ? void 0 : "content",
			className: numberOfMonths > 1 ? date_picker_module_default.wide : void 0,
			"aria-label": "Choose a date range",
			onOpenAutoFocus: (event) => event.preventDefault(),
			children: /* @__PURE__ */ jsxs("div", {
				"data-slot": "date-range-picker-panel",
				"data-commit": commitMode,
				className: date_picker_module_default.panel,
				children: [presets?.length ? /* @__PURE__ */ jsx("div", {
					role: "group",
					"aria-label": "Presets",
					"data-slot": "date-range-picker-presets",
					className: date_picker_module_default.presets,
					children: presets.map((preset) => /* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						className: "justify-start",
						"aria-pressed": sameDay(preset.range.from, shown?.from) && sameDay(preset.range.to, shown?.to),
						onClick: () => choosePreset(preset.range),
						children: preset.label
					}, preset.label))
				}) : null, /* @__PURE__ */ jsxs("div", {
					className: date_picker_module_default.main,
					children: [/* @__PURE__ */ jsx(Calendar, {
						mode: "range",
						autoFocus: true,
						"aria-label": "Date range",
						locale,
						numberOfMonths,
						disabled,
						month,
						onMonthChange: setMonth,
						selected: draft,
						onSelect: (_range, day) => {
							const next = pickRange(draft, day);
							setDraft(next);
							if (!apply && isComplete(next)) commit(next);
						}
					}), /* @__PURE__ */ jsxs("div", {
						"data-slot": "date-range-picker-footer",
						className: date_picker_module_default.footer,
						children: [/* @__PURE__ */ jsx("span", {
							role: "status",
							className: cn(controls_module_default.caption, date_picker_module_default.status),
							children: status
						}), apply ? /* @__PURE__ */ jsxs("div", {
							className: date_picker_module_default.actions,
							children: [
								draft?.from ? /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setDraft(void 0),
									children: "Clear"
								}) : null,
								/* @__PURE__ */ jsx(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setOpen(false),
									children: "Cancel"
								}),
								/* @__PURE__ */ jsx(Button, {
									variant: "accent",
									size: "sm",
									disabled: Boolean(draft?.from) && !isComplete(draft),
									onClick: () => commit(draft),
									children: "Apply"
								})
							]
						}) : value?.from || draft?.from ? /* @__PURE__ */ jsx(Button, {
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