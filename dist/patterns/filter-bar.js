import { Button } from "../ui/button.js";
import { ButtonGroup } from "../ui/button-group.js";
import { Calendar } from "../ui/calendar.js";
import { pickRange } from "../ui/date-range-picker.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu.js";
import { Input } from "../ui/input.js";
import { MultiSelect } from "../ui/multi-select.js";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.js";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group.js";
import filter_bar_module_default from "./filter-bar.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/patterns/filter-bar.tsx
var isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
var parseDate = (value) => {
	if (!value) return void 0;
	const [year, month, day] = value.split("-").map(Number);
	return new Date(year, month - 1, day);
};
var shortRange = (from, to) => {
	const withYear = from.getFullYear() !== to.getFullYear() || from.getFullYear() !== (/* @__PURE__ */ new Date()).getFullYear();
	const format = (date) => date.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric",
		year: withYear ? "numeric" : void 0
	});
	return from.getTime() === to.getTime() ? format(from) : `${format(from)} to ${format(to)}`;
};
var describeFilter = (field, filter) => {
	if (field.type === "date") return {
		verb: filter.operator ?? "before",
		value: filter.values[0] ?? "any date"
	};
	if (field.type === "date-range") {
		const from = parseDate(filter.values[0]);
		const to = parseDate(filter.values[1]);
		if (!from || !to) return {
			verb: "is",
			value: "any date"
		};
		return {
			verb: from.getTime() === to.getTime() ? "on" : "from",
			value: shortRange(from, to)
		};
	}
	if (field.type === "text") return {
		verb: "contains",
		value: filter.values[0] ?? "anything"
	};
	const labels = filter.values.map((value) => field.options.find((option) => option.value === value)?.label ?? value);
	let value = "any";
	if (labels.length === 1) [value] = labels;
	else if (labels.length === 2) value = `${labels[0]} or ${labels[1]}`;
	else if (labels.length > 2) value = `${labels[0]} or ${labels.length - 1} more`;
	return {
		verb: "is",
		value
	};
};
var DateRangeFilter = ({ label, defaultMonth, values, onPick }) => {
	const [draft, setDraft] = React.useState(() => {
		const from = parseDate(values[0]);
		const to = parseDate(values[1]);
		return from && to ? {
			from,
			to
		} : void 0;
	});
	return /* @__PURE__ */ jsx(Calendar, {
		mode: "range",
		autoFocus: true,
		"aria-label": label,
		defaultMonth: draft?.from ?? defaultMonth,
		selected: draft,
		onSelect: (_range, day) => {
			const next = pickRange(draft, day);
			setDraft(next);
			if (next.from && next.to) onPick([isoDate(next.from), isoDate(next.to)]);
		}
	});
};
var withDraft = (list, draft) => {
	if (!draft) return list;
	if (list.some((filter) => filter.field === draft.filter.field)) return list.map((filter) => filter.field === draft.filter.field ? draft.filter : filter);
	const next = [...list];
	next.splice(Math.min(draft.index, next.length), 0, draft.filter);
	return next;
};
var FilterBar = ({ label, fields = [], value: valueProp, onChange, search, searchValue, onSearchChange, searchLabel = "Search", searchPlaceholder, width, actions }) => {
	const [uncontrolled, setUncontrolled] = React.useState([]);
	const value = valueProp ?? uncontrolled;
	const [draft, setDraftState] = React.useState(null);
	const draftRef = React.useRef(draft);
	const setDraft = (next) => {
		draftRef.current = next;
		setDraftState(next);
	};
	const shown = withDraft(value, draft);
	const [open, setOpen] = React.useState(null);
	const [focusTarget, setFocusTarget] = React.useState(null);
	const picked = React.useRef(null);
	const addButton = React.useRef(null);
	const triggers = React.useRef(/* @__PURE__ */ new Map());
	React.useEffect(() => {
		if (!focusTarget) return;
		(focusTarget === "add" ? addButton.current : triggers.current.get(focusTarget))?.focus();
		setFocusTarget(null);
	}, [focusTarget]);
	const latest = React.useRef(value);
	React.useLayoutEffect(() => {
		latest.current = value;
	}, [value]);
	const commit = (next) => {
		latest.current = next;
		if (valueProp === void 0) setUncontrolled(next);
		onChange?.(next);
	};
	const update = (key, patch) => {
		const current = latest.current;
		const pending = draftRef.current?.filter.field === key ? draftRef.current : null;
		const index = current.findIndex((filter) => filter.field === key);
		const base = index >= 0 ? current[index] : pending?.filter;
		if (!base) return;
		const next = {
			...base,
			...patch
		};
		const at = index >= 0 ? index : pending?.index ?? current.length;
		if (pending || !next.values.length) setDraft({
			filter: next,
			index: at
		});
		if (next.values.length) commit(index >= 0 ? current.map((filter) => filter.field === key ? next : filter) : [
			...current.slice(0, at),
			next,
			...current.slice(at)
		]);
		else if (index >= 0) commit(current.filter((filter) => filter.field !== key));
	};
	const remove = (key) => {
		const before = withDraft(latest.current, draftRef.current);
		const index = before.findIndex((filter) => filter.field === key);
		const next = before.filter((filter) => filter.field !== key);
		if (draftRef.current?.filter.field === key) setDraft(null);
		if (latest.current.some((filter) => filter.field === key)) commit(latest.current.filter((filter) => filter.field !== key));
		setFocusTarget((next[index] ?? next[index - 1])?.field ?? "add");
	};
	const add = (field) => {
		picked.current = field.key;
		setDraft({
			filter: {
				field: field.key,
				operator: field.type === "date" ? "before" : void 0,
				values: []
			},
			index: latest.current.length
		});
	};
	const changeOpen = (key, next) => {
		setOpen(next ? key : null);
		if (next) return;
		if (!latest.current.find((filter) => filter.field === key)?.values.length) remove(key);
		else if (draftRef.current?.filter.field === key) setDraft(null);
	};
	const searchControl = search ?? (onSearchChange || searchValue !== void 0 ? /* @__PURE__ */ jsx(Input, {
		icon: "search",
		"aria-label": searchLabel,
		placeholder: searchPlaceholder ?? searchLabel,
		value: searchValue ?? "",
		onChange: (event) => onSearchChange?.(event.target.value),
		onKeyDown: (event) => {
			if (event.key === "Escape" && searchValue) {
				event.preventDefault();
				onSearchChange?.("");
			}
		}
	}) : null);
	return /* @__PURE__ */ jsxs("div", {
		className: filter_bar_module_default.bar,
		"data-slot": "filter-bar",
		role: "search",
		"aria-label": label,
		children: [/* @__PURE__ */ jsxs("div", {
			className: filter_bar_module_default.top,
			children: [
				searchControl && /* @__PURE__ */ jsx("div", {
					className: filter_bar_module_default.search,
					"data-width": width,
					children: searchControl
				}),
				fields.length > 0 && /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						ref: addButton,
						variant: "outline",
						icon: "plus",
						children: "Add filter"
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "end",
					onCloseAutoFocus: (event) => {
						if (!picked.current) return;
						event.preventDefault();
						setOpen(picked.current);
						picked.current = null;
					},
					children: [/* @__PURE__ */ jsx(DropdownMenuLabel, { children: "Filter by" }), fields.map((field) => {
						const applied = shown.some((filter) => filter.field === field.key);
						return /* @__PURE__ */ jsx(DropdownMenuItem, {
							disabled: applied,
							description: applied ? "Already applied" : void 0,
							onSelect: () => add(field),
							children: field.label
						}, field.key);
					})]
				})] }),
				actions && /* @__PURE__ */ jsx("div", {
					className: filter_bar_module_default.actions,
					children: actions
				})
			]
		}), shown.length > 0 && /* @__PURE__ */ jsxs("div", {
			className: filter_bar_module_default.applied,
			children: [/* @__PURE__ */ jsx("ul", {
				className: filter_bar_module_default.chips,
				"aria-label": "Applied filters",
				children: shown.map((filter) => {
					const field = fields.find((entry) => entry.key === filter.field);
					if (!field) return null;
					const text = describeFilter(field, filter);
					const trigger = /* @__PURE__ */ jsxs(Button, {
						ref: (node) => {
							if (node) triggers.current.set(field.key, node);
							else triggers.current.delete(field.key);
						},
						variant: "outline",
						iconRight: "chev-down",
						"aria-label": `${field.label} ${text.verb} ${text.value}`,
						children: [/* @__PURE__ */ jsx("span", {
							className: filter_bar_module_default.field,
							children: `${field.label} ${text.verb}`
						}), /* @__PURE__ */ jsx("span", {
							className: filter_bar_module_default.value,
							children: text.value
						})]
					});
					const isOpen = open === field.key;
					const openChange = (next) => changeOpen(field.key, next);
					let picker;
					if (field.type === "select") picker = /* @__PURE__ */ jsx(MultiSelect, {
						multiple: false,
						label: field.label,
						options: field.options,
						searchable: field.searchable,
						value: filter.values[0] ?? null,
						onChange: (next) => update(field.key, { values: next ? [next] : [] }),
						open: isOpen,
						onOpenChange: openChange,
						trigger
					});
					else if (field.type === "multi-select") picker = /* @__PURE__ */ jsx(MultiSelect, {
						label: field.label,
						options: field.options,
						searchable: field.searchable,
						value: filter.values,
						onChange: (next) => update(field.key, { values: next }),
						open: isOpen,
						onOpenChange: openChange,
						trigger
					});
					else picker = /* @__PURE__ */ jsxs(Popover, {
						open: isOpen,
						onOpenChange: openChange,
						children: [/* @__PURE__ */ jsx(PopoverTrigger, {
							asChild: true,
							children: trigger
						}), /* @__PURE__ */ jsxs(PopoverContent, {
							align: "start",
							"data-width": field.type === "date-range" ? "content" : void 0,
							"aria-label": `${field.label} filter`,
							onOpenAutoFocus: (event) => {
								if (field.type === "date-range") event.preventDefault();
							},
							children: [
								field.type === "date-range" && /* @__PURE__ */ jsx(DateRangeFilter, {
									label: field.label,
									defaultMonth: field.defaultMonth,
									values: filter.values,
									onPick: (next) => {
										update(field.key, { values: next });
										openChange(false);
									}
								}),
								field.type === "date" && /* @__PURE__ */ jsxs("div", {
									className: filter_bar_module_default.date,
									children: [/* @__PURE__ */ jsxs(ToggleGroup, {
										type: "single",
										size: "sm",
										"aria-label": `${field.label} comparison`,
										value: filter.operator ?? "before",
										onValueChange: (next) => {
											if (next === "before" || next === "after") update(field.key, { operator: next });
										},
										children: [/* @__PURE__ */ jsx(ToggleGroupItem, {
											value: "before",
											children: "Before"
										}), /* @__PURE__ */ jsx(ToggleGroupItem, {
											value: "after",
											children: "After"
										})]
									}), /* @__PURE__ */ jsx(Calendar, {
										mode: "single",
										"aria-label": field.label,
										defaultMonth: parseDate(filter.values[0]) ?? field.defaultMonth,
										selected: parseDate(filter.values[0]),
										onSelect: (date) => update(field.key, { values: date ? [isoDate(date)] : [] })
									})]
								}),
								field.type === "text" && /* @__PURE__ */ jsx(Input, {
									"aria-label": field.label,
									placeholder: field.placeholder,
									value: filter.values[0] ?? "",
									onChange: (event) => update(field.key, { values: event.target.value ? [event.target.value] : [] }),
									onKeyDown: (event) => {
										if (event.key === "Enter") openChange(false);
									}
								})
							]
						})]
					});
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(ButtonGroup, {
						label: `${field.label} filter`,
						children: [picker, /* @__PURE__ */ jsx(Button, {
							variant: "outline",
							icon: "x",
							iconOnly: true,
							onClick: () => remove(field.key),
							children: `Remove ${field.label} filter`
						})]
					}) }, field.key);
				})
			}), /* @__PURE__ */ jsx(Button, {
				variant: "link",
				onClick: () => {
					setDraft(null);
					commit([]);
					setFocusTarget("add");
				},
				children: "Clear filters"
			})]
		})]
	});
};
export { FilterBar, describeFilter };

//# sourceMappingURL=filter-bar.js.map