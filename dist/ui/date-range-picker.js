"use client";
import { useIsMobile } from "../hooks/use-mobile.js";
import { FieldControlContext, useFieldControlAttributes } from "../lib/field-context.js";
import { cn, titleIfClamped } from "../lib/utils.js";
import { Button } from "./button.js";
import { Calendar } from "./calendar.js";
import { Input } from "./input.js";
import { Label } from "./label.js";
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
var sameMinute = (a, b) => Boolean(a && b && Math.floor(a.getTime() / 6e4) === Math.floor(b.getTime() / 6e4));
var timeOf = (date) => `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
var atTime = (day, time) => {
	const [hours, minutes] = time.split(":").map(Number);
	const date = new Date(day);
	date.setHours(hours, minutes, 0, 0);
	return date;
};
var rangeTimeError = (range, times) => {
	if (!range?.from) return void 0;
	if (!times.from) return {
		end: "from",
		message: "Enter a start time"
	};
	if (!times.to) return {
		end: "to",
		message: "Enter an end time"
	};
	if (timeOf(range.from) !== times.from) return {
		end: "from",
		message: "That start time does not exist on this day"
	};
	if (range.to && timeOf(range.to) !== times.to) return {
		end: "to",
		message: "That end time does not exist on this day"
	};
	if (range.to && range.to < range.from) return {
		end: "to",
		message: "End time is before the start time"
	};
};
var defaultFormat = (range, locale, withTime) => {
	const format = (date) => withTime ? date.toLocaleString(locale?.code, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	}) : date.toLocaleDateString(locale?.code, {
		month: "short",
		day: "numeric",
		year: "numeric"
	});
	return `${format(range.from)} to ${format(range.to)}`;
};
function DateRangePanel({ value, onValueChange, onClose, disabled, numberOfMonths, presets, withTime, commit: commitMode, defaultMonth, locale, formatRange }) {
	const [draft, setDraft] = React.useState(value);
	const [month, setMonth] = React.useState(() => value?.from ?? defaultMonth ?? /* @__PURE__ */ new Date());
	const [times, setTimes] = React.useState(() => ({
		from: value?.from ? timeOf(value.from) : "00:00",
		to: value?.to ? timeOf(value.to) : "23:59"
	}));
	const timeId = React.useId();
	const apply = commitMode === "apply";
	const format = (range) => formatRange?.(range) ?? defaultFormat(range, locale, withTime);
	const sameEnd = withTime ? sameMinute : sameDay;
	const timeError = withTime ? rangeTimeError(draft, times) : void 0;
	const canApply = !draft?.from || isComplete(draft) && !timeError;
	const commit = (next) => {
		onValueChange(next);
		onClose();
	};
	const choosePreset = (range) => {
		if (withTime) setTimes({
			from: range.from ? timeOf(range.from) : times.from,
			to: range.to ? timeOf(range.to) : times.to
		});
		if (!apply) return commit(range);
		setDraft(range);
		if (range.from) setMonth(range.from);
	};
	const changeTime = (end, time) => {
		const nextTimes = {
			...times,
			[end]: time
		};
		setTimes(nextTimes);
		const day = draft?.[end];
		if (!time || !day) return;
		const next = {
			...draft,
			from: draft?.from,
			[end]: atTime(day, time)
		};
		setDraft(next);
		if (!apply && isComplete(next) && !rangeTimeError(next, nextTimes)) onValueChange(next);
	};
	const shown = apply ? draft : value;
	let status = "Choose a start date";
	if (draft?.from && !draft.to) status = "Choose an end date";
	else if (timeError) status = timeError.message;
	else if (isComplete(draft)) status = format(draft);
	return /* @__PURE__ */ jsxs("div", {
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
				"aria-pressed": sameEnd(preset.range.from, shown?.from) && sameEnd(preset.range.to, shown?.to),
				onClick: () => choosePreset(preset.range),
				children: preset.label
			}, preset.label))
		}) : null, /* @__PURE__ */ jsxs("div", {
			className: date_picker_module_default.main,
			children: [
				/* @__PURE__ */ jsx(Calendar, {
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
						const picked = pickRange(draft, day);
						const next = withTime ? {
							from: picked.from && atTime(picked.from, times.from || "00:00"),
							to: picked.to && atTime(picked.to, times.to || "23:59")
						} : picked;
						setDraft(next);
						if (!apply && isComplete(next) && !(withTime && rangeTimeError(next, times))) commit(next);
					}
				}),
				withTime ? /* @__PURE__ */ jsx(FieldControlContext, {
					value: {},
					children: /* @__PURE__ */ jsx("div", {
						"data-slot": "date-range-picker-times",
						className: date_picker_module_default.times,
						children: ["from", "to"].map((end) => /* @__PURE__ */ jsxs("div", {
							className: date_picker_module_default.time,
							children: [/* @__PURE__ */ jsx(Label, {
								htmlFor: `${timeId}-${end}`,
								children: end === "from" ? "Start time" : "End time"
							}), /* @__PURE__ */ jsx(Input, {
								id: `${timeId}-${end}`,
								type: "time",
								value: times[end],
								invalid: timeError?.end === end,
								onChange: (event) => changeTime(end, event.target.value),
								onKeyDown: (event) => {
									if (event.key === "Enter" && apply && isComplete(draft) && canApply) commit(draft);
								}
							})]
						}, end))
					})
				}) : null,
				/* @__PURE__ */ jsxs("div", {
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
								onClick: onClose,
								children: "Cancel"
							}),
							/* @__PURE__ */ jsx(Button, {
								variant: "accent",
								size: "sm",
								disabled: !canApply,
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
				})
			]
		})]
	});
}
/** DateRangePicker's popover for your own trigger, such as a filter chip, with the same presets, months and commit rule. Render it inside a Popover. */
function DateRangePickerContent({ align = "start", numberOfMonths = 1, presets, withTime, commit = withTime || numberOfMonths > 1 || presets?.length ? "apply" : "immediate", "aria-label": ariaLabel = "Choose a date range", ...props }) {
	const months = useIsMobile() ? 1 : numberOfMonths;
	return /* @__PURE__ */ jsx(PopoverContent, {
		align,
		"data-width": months > 1 ? void 0 : "content",
		className: months > 1 ? date_picker_module_default.wide : void 0,
		"aria-label": ariaLabel,
		onOpenAutoFocus: (event) => event.preventDefault(),
		children: /* @__PURE__ */ jsx(DateRangePanel, {
			...props,
			numberOfMonths: months,
			presets,
			withTime,
			commit
		})
	});
}
function DateRangePicker({ value, onValueChange, placeholder = "Choose dates", disabled, numberOfMonths, presets, withTime, commit, align, locale, formatRange, badge, className, ...props }) {
	const [open, setOpen] = React.useState(false);
	const field = useFieldControlAttributes(props);
	const generatedId = React.useId();
	const id = field.id ?? generatedId;
	const format = (range) => formatRange?.(range) ?? defaultFormat(range, locale, withTime);
	const valueText = React.useRef(null);
	const valueLabel = isComplete(value) ? format(value) : void 0;
	React.useLayoutEffect(() => {
		if (valueText.current) titleIfClamped(valueText.current);
	}, [valueLabel]);
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: setOpen,
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
				children: isComplete(value) && badge !== void 0 ? /* @__PURE__ */ jsxs("span", {
					className: controls_module_default.triggerValue,
					children: [/* @__PURE__ */ jsx("span", {
						ref: valueText,
						"data-slot": "option-text",
						onPointerEnter: (event) => titleIfClamped(event.currentTarget),
						children: format(value)
					}), badge]
				}) : isComplete(value) ? format(value) : /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground",
					children: placeholder
				})
			})
		}), /* @__PURE__ */ jsx(DateRangePickerContent, {
			value,
			onValueChange,
			onClose: () => setOpen(false),
			disabled,
			numberOfMonths,
			presets,
			withTime,
			commit,
			align,
			locale,
			formatRange
		})]
	});
}
DateRangePicker.displayName = "DateRangePicker";
export { DateRangePicker, DateRangePickerContent, pickRange };

//# sourceMappingURL=date-range-picker.js.map