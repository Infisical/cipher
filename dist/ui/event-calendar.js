"use client";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Popover, PopoverAnchor, PopoverContent, PopoverHeader, PopoverTitle } from "./popover.js";
import { Spinner } from "./spinner.js";
import event_calendar_module_default from "./event-calendar.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/event-calendar.tsx
var dayKey = (date) => date.toDateString();
var plural = (count) => `${count} event${count === 1 ? "" : "s"}`;
var addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
var startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
var sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
var addMonths = (date, amount) => {
	const lastDay = new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate();
	return new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), lastDay));
};
var startOfWeek = (date, weekStartsOn) => addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
var moves = {
	ArrowLeft: (day) => addDays(day, -1),
	ArrowRight: (day) => addDays(day, 1),
	ArrowUp: (day) => addDays(day, -7),
	ArrowDown: (day) => addDays(day, 7),
	Home: (day, weekStartsOn) => startOfWeek(day, weekStartsOn),
	End: (day, weekStartsOn) => addDays(startOfWeek(day, weekStartsOn), 6),
	PageUp: (day) => addMonths(day, -1),
	PageDown: (day) => addMonths(day, 1)
};
function EventCalendar({ events, month: monthProp, defaultMonth, onMonthChange, maxEvents = 2, weekStartsOn = 1, categories, onEventSelect, loading = false, locale, className, ...props }) {
	const [month, setMonth] = useControllableState({
		value: monthProp && startOfMonth(monthProp),
		defaultValue: startOfMonth(defaultMonth ?? /* @__PURE__ */ new Date()),
		onChange: onMonthChange
	});
	const today = /* @__PURE__ */ new Date();
	const [focused, setFocused] = React.useState(() => sameMonth(today, month) ? today : month);
	const [openDay, setOpenDay] = React.useState(null);
	const grid = React.useRef(null);
	const anchor = React.useRef(null);
	const moveFocus = React.useRef(false);
	const interactedOutside = React.useRef(false);
	const id = React.useId();
	const monthTime = month.getTime();
	const weeks = React.useMemo(() => {
		const first = new Date(monthTime);
		const leading = (first.getDay() - weekStartsOn + 7) % 7;
		const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
		return Array.from({ length: Math.ceil((leading + daysInMonth) / 7) }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day - leading)));
	}, [monthTime, weekStartsOn]);
	const visibleKeys = React.useMemo(() => new Set(weeks.flat().map(dayKey)), [weeks]);
	const focusedDay = visibleKeys.has(dayKey(focused)) ? focused : month;
	const focusedKey = dayKey(focusedDay);
	const openKey = openDay ? dayKey(openDay) : null;
	const byDay = React.useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		for (const event of events) {
			const key = dayKey(event.date);
			const day = map.get(key);
			if (day) day.push(event);
			else map.set(key, [event]);
		}
		return map;
	}, [events]);
	React.useEffect(() => {
		if (!moveFocus.current) return;
		moveFocus.current = false;
		grid.current?.querySelector(`[data-day="${focusedKey}"]`)?.focus();
	}, [focusedKey]);
	const shiftMonth = (amount) => {
		const next = addMonths(month, amount);
		setMonth(next);
		setFocused(sameMonth(today, next) ? today : next);
	};
	const open = (day, element) => {
		anchor.current = element;
		interactedOutside.current = false;
		setFocused(day);
		setOpenDay(day);
	};
	const format = (date, options) => date.toLocaleDateString(locale?.code, options);
	const openEvents = openKey ? byDay.get(openKey) ?? [] : [];
	const eventContent = (event, withCategory) => /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("span", {
			"aria-hidden": true,
			className: event_calendar_module_default.dot
		}),
		/* @__PURE__ */ jsx("span", {
			className: event_calendar_module_default.eventLabel,
			children: event.label
		}),
		withCategory && event.category ? /* @__PURE__ */ jsx("span", {
			className: event_calendar_module_default.eventCategory,
			children: event.category
		}) : null
	] });
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "event-calendar",
		role: "group",
		className: cn(event_calendar_module_default.root, className),
		"aria-busy": loading || void 0,
		...props,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: event_calendar_module_default.toolbar,
				children: [
					/* @__PURE__ */ jsx("h2", {
						id: `${id}-month`,
						"aria-live": "polite",
						className: event_calendar_module_default.heading,
						children: format(month, {
							month: "long",
							year: "numeric"
						})
					}),
					loading ? /* @__PURE__ */ jsx(Spinner, { label: "Loading events" }) : null,
					/* @__PURE__ */ jsxs("div", {
						className: event_calendar_module_default.nav,
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon-sm",
							icon: "chev-left",
							iconOnly: true,
							onClick: () => shiftMonth(-1),
							children: "Previous month"
						}), /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon-sm",
							icon: "chev-right",
							iconOnly: true,
							onClick: () => shiftMonth(1),
							children: "Next month"
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs(Popover, {
				open: openDay !== null,
				onOpenChange: (next) => {
					if (!next) setOpenDay(null);
				},
				children: [
					/* @__PURE__ */ jsx(PopoverAnchor, { virtualRef: anchor }),
					/* @__PURE__ */ jsxs("div", {
						ref: grid,
						role: "grid",
						"aria-labelledby": `${id}-month`,
						className: event_calendar_module_default.grid,
						onKeyDown: (event) => {
							const move = moves[event.key];
							if (!move) return;
							event.preventDefault();
							const next = move(focusedDay, weekStartsOn);
							if (dayKey(next) === focusedKey) return;
							moveFocus.current = true;
							setFocused(next);
							if (event.key === "PageUp" || event.key === "PageDown" || !visibleKeys.has(dayKey(next))) setMonth(startOfMonth(next));
						},
						children: [/* @__PURE__ */ jsx("div", {
							role: "row",
							className: event_calendar_module_default.row,
							children: weeks[0].map((day) => /* @__PURE__ */ jsx("div", {
								role: "columnheader",
								"aria-label": format(day, { weekday: "long" }),
								className: event_calendar_module_default.weekday,
								children: format(day, { weekday: "short" })
							}, day.getDay()))
						}), weeks.map((week) => /* @__PURE__ */ jsx("div", {
							role: "row",
							className: event_calendar_module_default.row,
							children: week.map((day) => {
								const key = dayKey(day);
								const dayEvents = byDay.get(key) ?? [];
								const overflow = dayEvents.length > maxEvents;
								const visible = overflow ? dayEvents.slice(0, Math.max(maxEvents - 1, 0)) : dayEvents;
								const isToday = dayKey(day) === dayKey(today);
								const name = format(day, {
									weekday: "long",
									month: "long",
									day: "numeric",
									year: "numeric"
								});
								return /* @__PURE__ */ jsxs("div", {
									role: "gridcell",
									"data-day": key,
									"data-outside": !sameMonth(day, month) || void 0,
									"data-today": isToday || void 0,
									tabIndex: key === focusedKey ? 0 : -1,
									"aria-current": isToday ? "date" : void 0,
									"aria-haspopup": "dialog",
									"aria-expanded": openKey === key,
									"aria-label": `${name}${isToday ? ", today" : ""}, ${dayEvents.length ? plural(dayEvents.length) : "no events"}`,
									className: event_calendar_module_default.day,
									onFocus: () => setFocused(day),
									onClick: (event) => open(day, event.currentTarget),
									onKeyDown: (event) => {
										if (event.key !== "Enter" && event.key !== " ") return;
										if (event.target !== event.currentTarget) return;
										event.preventDefault();
										open(day, event.currentTarget);
									},
									children: [/* @__PURE__ */ jsx("span", {
										"aria-hidden": true,
										className: event_calendar_module_default.dayNumber,
										children: day.getDate()
									}), dayEvents.length ? /* @__PURE__ */ jsxs("div", {
										className: event_calendar_module_default.events,
										children: [visible.map((item) => onEventSelect ? /* @__PURE__ */ jsx("button", {
											type: "button",
											tabIndex: -1,
											title: item.label,
											"data-tone": item.tone ?? "info",
											className: event_calendar_module_default.pill,
											onClick: (event) => {
												event.stopPropagation();
												onEventSelect(item);
											},
											children: eventContent(item, false)
										}, item.id) : /* @__PURE__ */ jsx("span", {
											title: item.label,
											"data-tone": item.tone ?? "info",
											className: event_calendar_module_default.pill,
											children: eventContent(item, false)
										}, item.id)), overflow ? /* @__PURE__ */ jsxs("span", {
											"aria-hidden": true,
											className: event_calendar_module_default.more,
											children: [
												"+",
												dayEvents.length - visible.length,
												" more"
											]
										}) : null]
									}) : null]
								}, key);
							})
						}, dayKey(week[0])))]
					}),
					/* @__PURE__ */ jsxs(PopoverContent, {
						align: "start",
						"aria-labelledby": `${id}-day`,
						className: event_calendar_module_default.popover,
						onInteractOutside: () => {
							interactedOutside.current = true;
						},
						onCloseAutoFocus: (event) => {
							event.preventDefault();
							if (!interactedOutside.current) anchor.current?.focus();
						},
						children: [/* @__PURE__ */ jsxs(PopoverHeader, { children: [/* @__PURE__ */ jsx(PopoverTitle, {
							id: `${id}-day`,
							className: event_calendar_module_default.popoverTitle,
							children: openDay ? format(openDay, {
								weekday: "long",
								month: "long",
								day: "numeric"
							}) : null
						}), /* @__PURE__ */ jsx("p", {
							className: event_calendar_module_default.popoverCount,
							children: openEvents.length ? plural(openEvents.length) : "No events"
						})] }), openEvents.length ? /* @__PURE__ */ jsx("ul", {
							className: event_calendar_module_default.list,
							children: openEvents.map((item) => /* @__PURE__ */ jsx("li", {
								"data-tone": item.tone ?? "info",
								className: event_calendar_module_default.tone,
								children: onEventSelect ? /* @__PURE__ */ jsx("button", {
									type: "button",
									className: event_calendar_module_default.listItem,
									onClick: () => {
										setOpenDay(null);
										onEventSelect(item);
									},
									children: eventContent(item, true)
								}) : /* @__PURE__ */ jsx("span", {
									className: event_calendar_module_default.listItem,
									children: eventContent(item, true)
								})
							}, item.id))
						}) : null]
					})
				]
			}),
			categories?.length ? /* @__PURE__ */ jsx("ul", {
				"aria-label": "Legend",
				className: event_calendar_module_default.legend,
				children: categories.map((category) => /* @__PURE__ */ jsxs("li", {
					"data-tone": category.tone,
					className: event_calendar_module_default.legendItem,
					children: [/* @__PURE__ */ jsx("span", {
						"aria-hidden": true,
						className: event_calendar_module_default.dot
					}), category.label]
				}, category.label))
			}) : null
		]
	});
}
EventCalendar.displayName = "EventCalendar";
export { EventCalendar };

//# sourceMappingURL=event-calendar.js.map