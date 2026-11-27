"use client";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { useOptionCreation } from "../lib/use-option-creation.js";
import { cn, titleIfClamped } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { useMenuInset } from "./menu-inset.js";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover.js";
import { Spinner } from "./spinner.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/multi-select.tsx
function MultiSelect({ ref, ...props }) {
	const { options, label, placeholder = "Select options", allLabel, disabled, invalid, searchable: searchableProp = false, searchPlaceholder = "Search options", emptyText = "No options found", footer, noMatchText = "No options found", onSearch, loading = false, anchorRef, renderValue, trigger, size = "sm", align = "start", side = "bottom", menuWidth, quickActions = true, closeOnFocusOutside = true, createAction, className } = props;
	const optionValues = /* @__PURE__ */ new Set();
	options.forEach((option) => {
		if (optionValues.has(option.value)) throw new Error("MultiSelect option values must be unique.");
		optionValues.add(option.value);
	});
	const searchable = searchableProp || Boolean(onSearch);
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
	const creation = useOptionCreation(props.onCreate, () => {
		setQuery("");
		onSearch?.("");
		search.current?.focus();
	});
	const { creating, error: createError } = creation;
	const changeQuery = (next) => {
		creation.cancel();
		setQuery(next);
		setActive("");
		onSearch?.(next);
	};
	const changeOpen = (next) => {
		if (disabled && next) return;
		creation.cancel();
		setOpen(next);
		if (next || !query) return;
		setQuery("");
		onSearch?.("");
	};
	const [remembered, setRemembered] = React.useState([]);
	React.useLayoutEffect(() => {
		creation.cancel();
	}, [
		open,
		disabled,
		creation.cancel
	]);
	const canCreate = Boolean(props.onCreate && query.trim() && !options.some((option) => option.label.toLowerCase() === query.trim().toLowerCase()));
	const create = () => {
		if (canCreate && !creating && !loading && !disabled) creation.create(query.trim());
	};
	const [active, setActive] = React.useState("");
	const prefix = React.useRef({
		value: "",
		at: 0
	});
	const list = React.useRef(null);
	const listInset = useMenuInset(list);
	const search = React.useRef(null);
	const apply = (values, keepOrder = false) => {
		if (disabled) return;
		if (props.multiple === false) {
			const next = values[0] ?? null;
			if (props.value === void 0) setInternal(next);
			props.onChange?.(next);
		} else {
			const included = new Set(values);
			const ordered = onSearch || keepOrder ? [...included] : options.filter((option) => included.has(option.value)).map((option) => option.value);
			if (props.value === void 0) setInternal(ordered);
			props.onChange?.(ordered);
		}
	};
	const shown = options.filter((option) => selected.includes(option.value));
	if (onSearch && shown.some((option) => !remembered.includes(option))) setRemembered((known) => [...known.filter((item) => !shown.some((option) => option.value === item.value)), ...shown]);
	const chosen = onSearch ? selected.flatMap((value) => options.find((option) => option.value === value) ?? remembered.find((option) => option.value === value) ?? []) : shown;
	const firstChosen = chosen[0];
	const eligible = options.filter((option) => !option.disabled);
	const allSelected = eligible.length > 0 && eligible.every((option) => selected.includes(option.value));
	const noneSelected = !eligible.some((option) => selected.includes(option.value));
	const multiple = props.multiple !== false;
	let summary = placeholder;
	if (renderValue) summary = renderValue(chosen);
	else if (firstChosen) summary = props.multiple !== false && allLabel && allSelected && !onSearch ? allLabel : /* @__PURE__ */ jsxs("span", {
		className: picker_module_default.summary,
		children: [/* @__PURE__ */ jsx("span", { children: firstChosen.label }), chosen.length > 1 && /* @__PURE__ */ jsxs("span", {
			className: picker_module_default.more,
			"aria-label": `${chosen.length - 1} more selected`,
			children: ["+", chosen.length - 1]
		})]
	});
	const filtered = onSearch ? options : options.filter((option) => [
		option.label,
		option.description,
		option.meta,
		option.group,
		...option.keywords ?? []
	].join(" ").toLowerCase().includes(query.toLowerCase()));
	const enabled = filtered.filter((option) => !option.disabled && !disabled);
	const createId = `${generated}-create`;
	const createQueryId = `${generated}-create-query`;
	const createBlocked = createAction?.disabledReason || void 0;
	const createQueryReady = canCreate && !creating && !loading && !disabled;
	const navigable = [
		...enabled.map((option) => option.value),
		...createQueryReady ? [createQueryId] : [],
		...createAction && !createBlocked && !disabled ? [createId] : []
	];
	const activeKey = navigable.includes(active) ? active : navigable[0];
	const createActive = activeKey === createId;
	const createQueryActive = activeKey === createQueryId;
	const currentActive = enabled.find((option) => option.value === activeKey);
	const optionId = (value) => `${generated}-option-${options.findIndex((option) => option.value === value)}`;
	const activeId = createActive || createQueryActive ? activeKey : currentActive && optionId(currentActive.value);
	React.useEffect(() => {
		if (open && activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
	}, [open, activeId]);
	const latestComplete = React.useRef((_option) => {});
	React.useLayoutEffect(() => {
		latestComplete.current = (option) => {
			if (onSearch) setRemembered((known) => [...known.filter((item) => item.value !== option.value), option]);
			apply(props.multiple === false ? [option.value] : [...selected.filter((value) => value !== option.value), option.value], true);
		};
	});
	const startCreate = () => {
		if (!createAction || createBlocked || disabled) return;
		const started = query.trim();
		changeOpen(false);
		createAction.onSelect({
			query: started,
			complete: (option) => latestComplete.current(option)
		});
	};
	const groups = [...new Set(filtered.map((option) => option.group ?? ""))];
	const all = () => apply([...selected, ...eligible.map((option) => option.value)]);
	const none = () => apply(selected.filter((value) => !eligible.some((option) => option.value === value)));
	const toggle = (option) => {
		if (option.disabled || disabled) return;
		if (onSearch) setRemembered((known) => [...known.filter((item) => item.value !== option.value), option]);
		if (props.multiple === false) {
			apply([option.value]);
			changeOpen(false);
		} else apply(selected.includes(option.value) ? selected.filter((value) => value !== option.value) : [...selected, option.value]);
	};
	const keydown = (event) => {
		if (event.nativeEvent.isComposing || event.keyCode === 229) return;
		if (event.target instanceof Element && event.target.closest("[data-slot=\"multi-select-footer\"]")) return;
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && props.multiple !== false && !onSearch) {
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
		const index = activeKey === void 0 ? -1 : navigable.indexOf(activeKey);
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setActive(navigable[(index + (event.key === "ArrowDown" ? 1 : -1) + navigable.length) % navigable.length] ?? "");
		} else if ((event.key === "Home" || event.key === "End") && event.target !== search.current) {
			event.preventDefault();
			setActive((event.key === "Home" ? navigable[0] : navigable[navigable.length - 1]) ?? "");
		} else if ((event.key === "Enter" || event.key === " " && event.target !== search.current) && activeKey !== void 0) {
			event.preventDefault();
			if (currentActive) toggle(currentActive);
			else if (createQueryActive) create();
			else startCreate();
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
						className: controls_module_default.chevron,
						"data-chevron": ""
					})]
				})
			}),
			/* @__PURE__ */ jsxs(PopoverContent, {
				align,
				side,
				surface: "menu",
				className: picker_module_default.panelColumn,
				style: { width: menuWidth },
				onFocusOutside: (event) => {
					if (!closeOnFocusOutside) event.preventDefault();
				},
				onInteractOutside: (event) => {
					const clear = event.target instanceof Element && event.target.closest("[data-slot=\"combobox-clear\"]");
					if (clear && (!clear.isConnected || anchorRef?.current?.contains(clear))) event.preventDefault();
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
						children: [
							/* @__PURE__ */ jsx(Icon, { name: "search" }),
							/* @__PURE__ */ jsx("input", {
								ref: search,
								role: "combobox",
								"aria-label": `Search ${label}`,
								"aria-controls": listId,
								"aria-expanded": open,
								"aria-autocomplete": "list",
								"aria-activedescendant": activeId,
								value: query,
								onChange: (event) => changeQuery(event.target.value),
								placeholder: searchPlaceholder
							}),
							loading && /* @__PURE__ */ jsx(Spinner, {})
						]
					}),
					multiple && quickActions && !onSearch && (options.length > 0 || selected.length > 0) ? /* @__PURE__ */ jsxs("div", {
						className: picker_module_default.quickBar,
						"data-slot": "multi-select-actions",
						children: [/* @__PURE__ */ jsx("span", {
							role: "status",
							"aria-live": "polite",
							className: picker_module_default.quickStatus,
							children: onSearch ? `${selected.length} selected` : `${chosen.length} of ${options.length} selected`
						}), [{
							text: "Select all",
							disabled: allSelected || !eligible.length,
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
					!filtered.length && (loading || !canCreate) && /* @__PURE__ */ jsx("p", {
						role: onSearch ? "status" : void 0,
						className: menu_module_default.empty,
						children: loading ? "Searching…" : options.length || onSearch && query.trim() ? noMatchText : emptyText
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: listInset,
						id: listId,
						role: "listbox",
						"aria-label": label,
						"aria-busy": loading || void 0,
						"aria-multiselectable": multiple || void 0,
						tabIndex: 0,
						"aria-activedescendant": activeId,
						"aria-owns": createAction ? createId : void 0,
						"data-scroll-fade": "y",
						className: cn(menu_module_default.list, menu_module_default.inset),
						children: [
							groups.map((group) => /* @__PURE__ */ jsxs("div", {
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
										option.icon ? /* @__PURE__ */ jsx(Icon, { icon: option.icon }) : option.media && /* @__PURE__ */ jsx("span", {
											"data-menu-icon": "",
											children: option.media
										}),
										option.description ? /* @__PURE__ */ jsxs("span", {
											className: cn(menu_module_default.text, picker_module_default.optionLabel),
											children: [/* @__PURE__ */ jsx("span", {
												className: menu_module_default.title,
												children: option.label
											}), /* @__PURE__ */ jsx("span", {
												className: menu_module_default.description,
												onPointerEnter: (event) => titleIfClamped(event.currentTarget),
												children: option.description
											})]
										}) : /* @__PURE__ */ jsx("span", {
											className: picker_module_default.optionLabel,
											children: option.label
										}),
										option.badge,
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
							}, group)),
							canCreate && /* @__PURE__ */ jsxs("div", {
								id: createQueryId,
								role: "option",
								tabIndex: -1,
								"aria-selected": false,
								"aria-disabled": createQueryReady ? void 0 : true,
								"data-active": createQueryActive || void 0,
								"data-slot": "multi-select-create-option",
								"data-highlight-default": "",
								"data-wrap": "",
								className: cn(menu_module_default.row, picker_module_default.option, picker_module_default.createOption),
								onPointerMove: () => {
									if (createQueryReady) setActive(createQueryId);
								},
								onMouseDown: (event) => event.preventDefault(),
								onClick: create,
								children: [multiple ? /* @__PURE__ */ jsx("span", {
									"aria-hidden": true,
									className: cn(picker_module_default.optionBox, "cipher-lead-line"),
									children: /* @__PURE__ */ jsx(Icon, { name: "plus" })
								}) : /* @__PURE__ */ jsx(Icon, {
									name: "plus",
									lead: true
								}), /* @__PURE__ */ jsx("span", {
									className: picker_module_default.optionLabel,
									children: creating ? "Creating…" : props.createLabel?.(query.trim()) ?? `Create "${query.trim()}"`
								})]
							}),
							/* @__PURE__ */ jsx(ListHighlight, {})
						]
					}),
					createAction && /* @__PURE__ */ jsx("div", {
						className: cn(menu_module_default.inset, menu_module_default.actionFooter),
						"data-slot": "multi-select-create-footer",
						children: /* @__PURE__ */ jsxs("div", {
							id: createId,
							role: "option",
							tabIndex: -1,
							"aria-selected": false,
							"aria-disabled": createBlocked || disabled ? true : void 0,
							"data-active": createActive || void 0,
							"data-slot": "multi-select-create",
							className: cn(menu_module_default.row, picker_module_default.option),
							onPointerMove: () => {
								if (!createBlocked) setActive(createId);
							},
							onMouseDown: (event) => event.preventDefault(),
							onClick: startCreate,
							children: [
								/* @__PURE__ */ jsx(Icon, { name: "plus" }),
								/* @__PURE__ */ jsx("span", {
									className: picker_module_default.optionLabel,
									children: createAction.label
								}),
								createBlocked && /* @__PURE__ */ jsx("span", {
									className: picker_module_default.optionMeta,
									children: createBlocked
								})
							]
						})
					}),
					footer && /* @__PURE__ */ jsx("div", {
						className: cn(menu_module_default.inset, menu_module_default.actionFooter),
						"data-slot": "multi-select-footer",
						children: typeof footer === "string" ? /* @__PURE__ */ jsx("p", {
							className: menu_module_default.footerText,
							children: footer
						}) : footer
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