import { Button, buttonVariants } from "./button.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
// src/ui/calendar.tsx
var rootFlags = {};
var rootWatch = {
	focus: true,
	marks: { "data-child-focus-visible": `.${controls_module_default.focusOutlineWithin}:has(> :focus-visible)` }
};
function CalendarRoot({ className, rootRef, ...props }) {
	const ref = useDescendantFlags(rootFlags, rootWatch, rootRef);
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "calendar",
		ref,
		className: cn(className),
		...props,
		role: props.role ?? "region",
		tabIndex: props.tabIndex ?? 0,
		"aria-label": props["aria-label"] ?? (props["aria-labelledby"] ? void 0 : "Calendar")
	});
}
/** The open-ended before and after dates in `disabled`, so navigation stops at the months that can be picked. */
function disabledBounds(disabled) {
	const bounds = {};
	for (const matcher of [disabled ?? []].flat()) {
		if (typeof matcher !== "object" || matcher instanceof Date || Array.isArray(matcher)) continue;
		if ("before" in matcher && !("after" in matcher)) bounds.before = matcher.before;
		if ("after" in matcher && !("before" in matcher)) bounds.after = matcher.after;
	}
	return bounds;
}
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", locale, formatters, components, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const bounds = disabledBounds(props.disabled);
	return /* @__PURE__ */ jsx(DayPicker, {
		showOutsideDays,
		className: cn("group/calendar max-w-full overflow-x-auto bg-background p-2 [--cell-radius:0px] [--cell-size:var(--cipher-size-control-default)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent in-data-[slot=popover-content]:p-0", String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className),
		captionLayout,
		locale,
		formatters: {
			formatMonthDropdown: (date) => date.toLocaleString(locale?.code, { month: "short" }),
			...formatters
		},
		classNames: {
			root: cn("w-fit", defaultClassNames.root),
			months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
			month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
			nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1", defaultClassNames.nav),
			button_previous: cn(buttonVariants({ variant: buttonVariant }), "size-(--cell-size) p-0 select-none aria-disabled:opacity-50", defaultClassNames.button_previous),
			button_next: cn(buttonVariants({ variant: buttonVariant }), "size-(--cell-size) p-0 select-none aria-disabled:opacity-50", defaultClassNames.button_next),
			month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
			dropdowns: cn(controls_module_default.label, "flex h-(--cell-size) w-full items-center justify-center gap-1.5", defaultClassNames.dropdowns),
			dropdown_root: cn("relative rounded-(--cell-radius)", controls_module_default.focusOutlineWithin, defaultClassNames.dropdown_root),
			dropdown: cn("absolute inset-0 bg-popover opacity-0", defaultClassNames.dropdown),
			caption_label: cn(controls_module_default.label, "select-none", captionLayout === "label" ? "text-sm" : "flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground", defaultClassNames.caption_label),
			month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
			weekdays: cn("flex", defaultClassNames.weekdays),
			weekday: cn(controls_module_default.caption, "flex-1 rounded-(--cell-radius) text-muted-foreground select-none", defaultClassNames.weekday),
			week: cn("mt-2 flex w-full", defaultClassNames.week),
			footer: cn(controls_module_default.body, "mt-3 text-center", defaultClassNames.footer),
			week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
			week_number: cn(controls_module_default.caption, "flex h-(--cell-size) w-(--cell-size) items-center justify-center text-muted-foreground select-none", defaultClassNames.week_number),
			day: cn(controls_module_default.body, "group/day relative h-(--cell-size) w-full min-w-(--cell-size) rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)", props.showWeekNumber ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)" : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)", defaultClassNames.day),
			range_start: cn("relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted", defaultClassNames.range_start),
			range_middle: cn("rounded-none", defaultClassNames.range_middle),
			range_end: cn("relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted", defaultClassNames.range_end),
			today: cn("rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none", defaultClassNames.today),
			outside: cn("text-muted-foreground aria-selected:text-muted-foreground", defaultClassNames.outside),
			disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
			hidden: cn("invisible", defaultClassNames.hidden),
			...classNames
		},
		components: {
			Root: CalendarRoot,
			Chevron: ({ className, orientation, ...props }) => {
				if (orientation === "left") return /* @__PURE__ */ jsx(Icon, {
					name: "chev-left",
					className: cn("size-4", className),
					...props
				});
				if (orientation === "right") return /* @__PURE__ */ jsx(Icon, {
					name: "chev-right",
					className: cn("size-4", className),
					...props
				});
				return /* @__PURE__ */ jsx(Icon, {
					name: "chev-down",
					className: cn("size-4", className),
					...props
				});
			},
			DayButton: ({ ...props }) => /* @__PURE__ */ jsx(CalendarDayButton, {
				locale,
				...props
			}),
			WeekNumber: ({ children, ...props }) => {
				return /* @__PURE__ */ jsx("td", {
					...props,
					children: /* @__PURE__ */ jsx("div", {
						className: "flex size-(--cell-size) items-center justify-center text-center",
						children
					})
				});
			},
			...components
		},
		...props,
		startMonth: props.startMonth ?? bounds.before,
		endMonth: props.endMonth ?? bounds.after
	});
}
function CalendarDayButton({ className, day, modifiers, locale, ...props }) {
	const defaultClassNames = getDefaultClassNames();
	const ref = React.useRef(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);
	return /* @__PURE__ */ jsx(Button, {
		ref,
		variant: "ghost",
		size: "icon",
		"data-day": day.date.toLocaleDateString(locale?.code),
		"data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
		"data-range-start": modifiers.range_start,
		"data-range-end": modifiers.range_end,
		"data-range-middle": modifiers.range_middle,
		className: cn("data-[range-end=true]:text-primary-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary relative isolate z-10 mx-auto flex size-(--cell-size) flex-col gap-1 border-0 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-[color:var(--cipher-focus-ring)] data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-muted data-[range-middle=true]:text-foreground data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className),
		...props
	});
}
export { Calendar, CalendarDayButton };

//# sourceMappingURL=calendar.js.map