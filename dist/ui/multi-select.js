import { useFieldControlAttributes } from "../lib/field-context.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { useOptionCreation } from "../lib/use-option-creation.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { useMenuInset } from "./menu-inset.js";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/multi-select.tsx
function MultiSelect({ ref, ...props }) {
	const { options, label, placeholder = "Select options", allLabel, disabled, invalid, searchable = false, anchorRef, renderValue, trigger, size = "sm", align = "start", side = "bottom", menuWidth, quickActions = true, closeOnFocusOutside = true, className } = props;
	const optionValues = /* @__PURE__ */ new Set();
	options.forEach((option) => {
		if (optionValues.has(option.value)) throw new Error("MultiSelect option values must be unique.");
		optionValues.add(option.value);
	});
	const field = useFieldControlAttributes(props);
	const generated = React.useId();
	const listId = `${generated}-list`;
	const [internal, setInternal] = React.useState(props.defaultValue ?? (props.multiple === false ? null : []));
	const current = props.value === void 0 ? internal : props.value;
	const selected = Array.isArray(current) ? current : current ? [current] : [];
	const [open, setOpen] = useControllableState({
		value: props.open,
		defaultValue: props.defaultOpen ?? false,
		onChange: props.onOpenChange
	});
	const [query, setQuery] = React.useState("");
	const creation = useOptionCreation(props.onCreate, () => setQuery(""));
	const { creating, error: createError } = creation;
	const changeQuery = (next) => {
		creation.cancel();
		setQuery(next);
	};
	const changeOpen = (next) => {
		if (disabled && next) return;
		creation.cancel();
		setOpen(next);
		if (!next) setQuery("");
	};
	React.useLayoutEffect(() => {
		creation.cancel();
	}, [
		open,
		disabled,
		creation.cancel
	]);
	const canCreate = Boolean(props.onCreate && query.trim() && !options.some((option) => option.label.toLowerCase() === query.trim().toLowerCase()));
	const create = () => {
		if (canCreate && !creating && !disabled) creation.create(query.trim());
	};
	const [active, setActive] = React.useState("");
	const prefix = React.useRef({
		value: "",
		at: 0
	});
	const list = React.useRef(null);
	const listInset = useMenuInset(list);
	const search = React.useRef(null);
	const apply = (values) => {
		if (disabled) return;
		if (props.multiple === false) {
			const next = values[0] ?? null;
			if (props.value === void 0) setInternal(next);
			props.onChange?.(next);
		} else {
			const included = new Set(values);
			const ordered = options.filter((option) => included.has(option.value)).map((option) => option.value);
			if (props.value === void 0) setInternal(ordered);
			props.onChange?.(ordered);
		}
	};
	const chosen = options.filter((option) => selected.includes(option.value));
	const firstChosen = chosen[0];
	const eligible = options.filter((option) => !option.disabled);
	const allSelected = eligible.length > 0 && eligible.every((option) => selected.includes(option.value));
	const noneSelected = !eligible.some((option) => selected.includes(option.value));
	const multiple = props.multiple !== false;
	let summary = placeholder;
	if (renderValue) summary = renderValue(chosen);
	else if (firstChosen) summary = props.multiple !== false && allLabel && allSelected ? allLabel : /* @__PURE__ */ jsxs("span", {
		className: picker_module_default.summary,
		children: [/* @__PURE__ */ jsx("span", { children: firstChosen.label }), chosen.length > 1 && /* @__PURE__ */ jsxs("span", {
			className: picker_module_default.more,
			"aria-label": `${chosen.length - 1} more selected`,
			children: ["+", chosen.length - 1]
		})]
	});
	const filtered = options.filter((option) => `${option.label} ${option.description ?? ""} ${option.meta ?? ""}`.toLowerCase().includes(query.toLowerCase()));
	const enabled = filtered.filter((option) => !option.disabled && !disabled);
	const currentActive = enabled.find((option) => option.value === active) ?? enabled[0];
	const optionId = (value) => `${generated}-option-${options.findIndex((option) => option.value === value)}`;
	React.useEffect(() => {
		if (open && currentActive) document.getElementById(optionId(currentActive.value))?.scrollIntoView({ block: "nearest" });
	}, [open, currentActive?.value]);
	const groups = [...new Set(filtered.map((option) => option.group ?? ""))];
	const all = () => apply(options.filter((option) => !option.disabled || selected.includes(option.value)).map((option) => option.value));
	const none = () => apply(selected.filter((value) => !eligible.some((option) => option.value === value)));
	const toggle = (option) => {
		if (option.disabled || disabled) return;
		if (props.multiple === false) {
			apply([option.value]);
			changeOpen(false);
		} else apply(selected.includes(option.value) ? selected.filter((value) => value !== option.value) : [...selected, option.value]);
	};
	const keydown = (event) => {
		if (event.nativeEvent.isComposing || event.keyCode === 229) return;
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && props.multiple !== false) {
			event.preventDefault();
			if (allSelected) none();
			else all();
			return;
		}
		if (event.target instanceof HTMLButtonElement) return;
		if (event.key === "Backspace" && !query && props.onEmptyBackspace) {
			event.preventDefault();
			props.onEmptyBackspace();
			return;
		}
		if (event.key === "Enter" && !currentActive && canCreate) {
			event.preventDefault();
			create();
			return;
		}
		const index = enabled.findIndex((option) => option.value === currentActive?.value);
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setActive(enabled[(index + (event.key === "ArrowDown" ? 1 : -1) + enabled.length) % enabled.length]?.value ?? "");
		} else if ((event.key === "Home" || event.key === "End") && event.target !== search.current) {
			event.preventDefault();
			setActive((event.key === "Home" ? enabled[0] : enabled[enabled.length - 1])?.value ?? "");
		} else if ((event.key === "Enter" || event.key === " " && event.target !== search.current) && currentActive) {
			event.preventDefault();
			toggle(currentActive);
		} else if (!searchable && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
			event.preventDefault();
			const now = Date.now();
			prefix.current = {
				value: (now - prefix.current.at < 500 ? prefix.current.value : "") + event.key.toLowerCase(),
				at: now
			};
			const found = enabled.find((option) => option.label.toLowerCase().startsWith(prefix.current.value));
			if (found) setActive(found.value);
		}
	};
	return /* @__PURE__ */ jsxs(Popover, {
		open: open && !disabled,
		onOpenChange: changeOpen,
		children: [
			anchorRef && /* @__PURE__ */ jsx(PopoverAnchor, { virtualRef: anchorRef }),
			/* @__PURE__ */ jsx(PopoverTrigger, {
				ref,
				asChild: true,
				disabled,
				...field,
				"aria-label": label,
				"aria-invalid": invalid || field["aria-invalid"] || void 0,
				children: trigger ? React.cloneElement(trigger, {
					...field,
					disabled: disabled || trigger.props.disabled,
					"aria-disabled": disabled || trigger.props.disabled || trigger.props["aria-disabled"],
					"aria-haspopup": "listbox",
					tabIndex: disabled ? -1 : trigger.props.tabIndex,
					onClickCapture: (event) => {
						if (disabled) {
							event.preventDefault();
							event.stopPropagation();
						} else trigger.props.onClickCapture?.(event);
					},
					onKeyDownCapture: (event) => {
						if (disabled && (event.key === "Enter" || event.key === " ")) {
							event.preventDefault();
							event.stopPropagation();
						} else trigger.props.onKeyDownCapture?.(event);
					},
					id: field.id ?? trigger.props.id,
					"aria-labelledby": field["aria-labelledby"] ?? trigger.props["aria-labelledby"],
					"aria-describedby": [field["aria-describedby"], trigger.props["aria-describedby"]].filter(Boolean).join(" ") || void 0,
					"aria-invalid": invalid || field["aria-invalid"] || trigger.props["aria-invalid"]
				}) : /* @__PURE__ */ jsxs("button", {
					...field,
					type: "button",
					"aria-label": label,
					"aria-haspopup": "listbox",
					disabled,
					"data-slot": "multi-select",
					"data-side": side,
					"data-align": align,
					"data-size": size,
					onKeyDown: (event) => {
						if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
						event.preventDefault();
						changeOpen(true);
					},
					className: cn(controls_module_default.field, controls_module_default.trigger, controls_module_default.triggerHover, className),
					children: [/* @__PURE__ */ jsx("span", {
						className: picker_module_default.triggerValue,
						"data-slot": "multi-select-value",
						"data-placeholder": !chosen.length || void 0,
						children: summary
					}), /* @__PURE__ */ jsx(Icon, {
						name: "chev-down",
						className: controls_module_default.chevron
					})]
				})
			}),
			/* @__PURE__ */ jsxs(PopoverContent, {
				align,
				side,
				surface: "menu",
				style: { width: menuWidth },
				onFocusOutside: (event) => {
					if (!closeOnFocusOutside) event.preventDefault();
				},
				onOpenAutoFocus: (event) => {
					event.preventDefault();
					(searchable ? search.current : list.current)?.focus();
				},
				onKeyDown: keydown,
				children: [
					searchable && /* @__PURE__ */ jsxs("div", {
						className: controls_module_default.searchRow,
						"data-slot": "multi-select-search",
						children: [/* @__PURE__ */ jsx(Icon, { name: "search" }), /* @__PURE__ */ jsx("input", {
							ref: search,
							role: "combobox",
							"aria-label": `Search ${label}`,
							"aria-controls": listId,
							"aria-expanded": open,
							"aria-autocomplete": "list",
							"aria-activedescendant": currentActive ? optionId(currentActive.value) : void 0,
							value: query,
							onChange: (event) => changeQuery(event.target.value),
							placeholder: "Search options"
						})]
					}),
					multiple && quickActions ? /* @__PURE__ */ jsxs("div", {
						className: picker_module_default.quickBar,
						"data-slot": "multi-select-actions",
						children: [/* @__PURE__ */ jsxs("span", {
							role: "status",
							"aria-live": "polite",
							className: picker_module_default.quickStatus,
							children: [
								chosen.length,
								" of ",
								options.length,
								" selected"
							]
						}), [{
							text: "Select all",
							disabled: allSelected,
							run: all
						}, {
							text: "Deselect all",
							disabled: noneSelected,
							run: none
						}].map((action) => /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "xs",
							disabled: disabled || action.disabled,
							onMouseDown: (event) => event.preventDefault(),
							onClick: () => {
								action.run();
								list.current?.focus();
							},
							children: action.text
						}, action.text))]
					}) : /* @__PURE__ */ jsxs("span", {
						role: "status",
						"aria-live": "polite",
						className: "sr-only",
						children: [selected.length, " selected"]
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: listInset,
						id: listId,
						role: "listbox",
						"aria-label": label,
						"aria-multiselectable": multiple || void 0,
						tabIndex: 0,
						"aria-activedescendant": currentActive ? optionId(currentActive.value) : void 0,
						"data-scroll-fade": "y",
						className: cn(menu_module_default.list, menu_module_default.inset),
						children: [groups.map((group) => /* @__PURE__ */ jsxs("div", {
							role: "group",
							"aria-label": group || void 0,
							children: [group && /* @__PURE__ */ jsx("div", {
								className: menu_module_default.label,
								children: group
							}), filtered.filter((option) => (option.group ?? "") === group).map((option) => /* @__PURE__ */ jsxs("div", {
								id: optionId(option.value),
								role: "option",
								tabIndex: -1,
								"aria-selected": selected.includes(option.value),
								"aria-disabled": option.disabled || void 0,
								"data-active": currentActive?.value === option.value || void 0,
								className: cn(menu_module_default.row, picker_module_default.option),
								onPointerMove: () => {
									if (!option.disabled) setActive(option.value);
								},
								onMouseDown: (event) => event.preventDefault(),
								onClick: () => toggle(option),
								children: [
									multiple && /* @__PURE__ */ jsx("span", {
										"aria-hidden": true,
										"data-state": selected.includes(option.value) ? "checked" : "unchecked",
										className: cn(controls_module_default.choiceMark, picker_module_default.optionBox),
										children: selected.includes(option.value) && /* @__PURE__ */ jsx(Icon, {
											name: "check",
											size: 13,
											strokeWidth: 2.6
										})
									}),
									option.description ? /* @__PURE__ */ jsxs("span", {
										className: cn(menu_module_default.text, picker_module_default.optionLabel),
										children: [/* @__PURE__ */ jsx("span", {
											className: menu_module_default.title,
											children: option.label
										}), /* @__PURE__ */ jsx("span", {
											className: menu_module_default.description,
											children: option.description
										})]
									}) : /* @__PURE__ */ jsx("span", {
										className: picker_module_default.optionLabel,
										children: option.label
									}),
									option.meta && /* @__PURE__ */ jsx("span", {
										className: picker_module_default.optionMeta,
										children: option.meta
									}),
									!multiple && /* @__PURE__ */ jsx("span", {
										className: picker_module_default.optionCheck,
										children: selected.includes(option.value) && /* @__PURE__ */ jsx(Icon, { name: "check" })
									})
								]
							}, option.value))]
						}, group)), /* @__PURE__ */ jsx(ListHighlight, {})]
					}),
					!filtered.length && /* @__PURE__ */ jsx("p", {
						className: menu_module_default.empty,
						children: "No options found"
					}),
					canCreate && /* @__PURE__ */ jsx("div", {
						className: menu_module_default.footer,
						"data-slot": "multi-select-footer",
						children: canCreate && /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "xs",
							loading: creating,
							disabled,
							onClick: create,
							children: props.createLabel?.(query.trim()) ?? `Create "${query.trim()}"`
						})
					}),
					createError && /* @__PURE__ */ jsx("p", {
						role: "alert",
						className: picker_module_default.error,
						children: createError
					})
				]
			})
		]
	});
}
MultiSelect.displayName = "MultiSelect";
export { MultiSelect };

//# sourceMappingURL=multi-select.js.map