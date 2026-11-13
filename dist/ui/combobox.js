import { useDiscardChangesGuard } from "../hooks/use-discard-changes-guard.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { useOptionCreation } from "../lib/use-option-creation.js";
import { cn } from "../lib/utils.js";
import { DiscardChangesAlertDialog } from "./alert-dialog.js";
import { Button } from "./button.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog.js";
import { Icon } from "./icon.js";
import { fieldBoxFlags, fieldBoxWatch } from "./input.js";
import { MultiSelect } from "./multi-select.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Spinner } from "./spinner.js";
import { Highlight } from "./text.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/combobox.tsx
function Combobox({ ref, ...props }) {
	const { options, placeholder = "Select an option", label, emptyText = "No options found", disabled, invalid, mono, onCreate, className } = props;
	const onSearch = props.multiple ? void 0 : props.onSearch;
	const loading = !props.multiple && Boolean(props.loading);
	const creationConfig = props.multiple ? void 0 : props.creation;
	const dialogCreation = creationConfig?.mode === "dialog" ? creationConfig : void 0;
	const inlineCreate = creationConfig?.mode === "inline" ? creationConfig.onCreate : onCreate;
	const creationBlocked = creationConfig?.disabledReason || void 0;
	const field = useFieldControlAttributes(props);
	const [internal, setInternal] = React.useState(props.defaultValue ?? (props.multiple ? [] : ""));
	const current = props.value === void 0 ? internal : props.value;
	const selected = Array.isArray(current) ? current : current ? [current] : [];
	const apply = (next) => {
		if (props.multiple) {
			if (props.value === void 0) setInternal(next);
			props.onChange?.(next);
			props.onValueChange?.(next);
		} else {
			const value = next[0] ?? "";
			if (props.value === void 0) setInternal(value);
			props.onChange?.(value);
			props.onValueChange?.(value);
		}
	};
	const [open, setOpen] = React.useState(props.defaultOpen ?? false);
	const closeOnFocusOutside = props.closeOnFocusOutside ?? !props.defaultOpen;
	const fieldRef = React.useRef(null);
	const fieldBoxRef = useDescendantFlags(fieldBoxFlags, fieldBoxWatch, fieldRef);
	const refocus = React.useRef(void 0);
	React.useLayoutEffect(() => {
		if (refocus.current === void 0) return;
		const target = refocus.current;
		refocus.current = void 0;
		(Array.from(fieldRef.current?.querySelectorAll("[data-slot=combobox-chip-remove]") ?? []).find((button) => button.dataset.value === target) ?? fieldRef.current?.querySelector("[data-slot=multi-select]"))?.focus();
	});
	const isLocked = (value) => disabled || Boolean(options.find((option) => option.value === value)?.disabled);
	const remove = (value) => {
		const index = selected.indexOf(value);
		refocus.current = selected.slice(index + 1).find((item) => !isLocked(item)) ?? selected.slice(0, index).reverse().find((item) => !isLocked(item)) ?? null;
		apply(selected.filter((item) => item !== value));
	};
	const contentId = React.useId();
	const [query, setQuery] = React.useState("");
	const creation = useOptionCreation(inlineCreate, () => changeOpen(false));
	const { creating, error } = creation;
	const changeQuery = (next) => {
		creation.cancel();
		setQuery(next);
		onSearch?.(next);
	};
	const changeOpen = (next) => {
		creation.cancel();
		setOpen(next);
		if (next || !query) return;
		setQuery("");
		onSearch?.("");
	};
	const [picked, setPicked] = React.useState();
	const selectedOption = options.find((option) => option.value === selected[0]) ?? (picked?.value === selected[0] ? picked : void 0);
	const filtered = onSearch ? options : options.filter((option) => `${option.label} ${option.meta ?? ""}`.toLowerCase().includes(query.toLowerCase()));
	const canCreate = inlineCreate && query.trim() && !options.some((option) => option.label.toLowerCase() === query.trim().toLowerCase());
	const triggerRef = React.useRef(null);
	const formId = React.useId();
	const sessionRef = React.useRef(0);
	const [session, setSession] = React.useState();
	const [formDirty, setFormDirty] = React.useState(false);
	const [formPending, setFormPending] = React.useState(false);
	const [formSubmitLabel, setFormSubmitLabel] = React.useState();
	const closeDialog = () => {
		sessionRef.current += 1;
		setSession((current) => current && {
			...current,
			open: false
		});
		setFormDirty(false);
		setFormPending(false);
	};
	const guard = useDiscardChangesGuard({
		isDirty: formDirty,
		onDiscard: closeDialog
	});
	const openDialog = () => {
		sessionRef.current += 1;
		setSession({
			id: sessionRef.current,
			query: query.trim(),
			open: true
		});
		setFormDirty(false);
		setFormPending(false);
		setFormSubmitLabel(void 0);
		changeOpen(false);
	};
	const complete = (id, option) => {
		if (id !== sessionRef.current) return;
		setPicked(option);
		apply([option.value]);
		closeDialog();
	};
	if (props.multiple) return /* @__PURE__ */ jsxs("div", {
		ref: fieldBoxRef,
		className: cn(controls_module_default.field, picker_module_default.multiCombobox),
		"data-size": "sm",
		"data-field-box": "",
		children: [
			selected.map((value) => {
				const chipLabel = options.find((option) => option.value === value)?.label ?? value;
				return /* @__PURE__ */ jsxs("span", {
					className: picker_module_default.chip,
					"data-locked": isLocked(value) || void 0,
					children: [/* @__PURE__ */ jsx("span", {
						title: chipLabel,
						children: chipLabel
					}), /* @__PURE__ */ jsx(Button, {
						type: "button",
						variant: "ghost",
						size: "icon-xs",
						"aria-label": `Remove ${chipLabel}`,
						"data-slot": "combobox-chip-remove",
						"data-value": value,
						disabled: isLocked(value),
						onClick: () => remove(value),
						onKeyDown: (event) => {
							if (event.key !== "Backspace" && event.key !== "Delete") return;
							event.preventDefault();
							remove(value);
						},
						children: /* @__PURE__ */ jsx(Icon, {
							name: "x",
							size: 12
						})
					})]
				}, value);
			}),
			/* @__PURE__ */ jsx(MultiSelect, {
				ref,
				id: props.id,
				"aria-describedby": props["aria-describedby"],
				options: options.map((option) => ({
					...option,
					description: option.meta
				})),
				value: selected,
				onChange: apply,
				label,
				placeholder,
				disabled,
				invalid,
				searchable: true,
				quickActions: false,
				anchorRef: fieldRef,
				defaultOpen: props.defaultOpen,
				closeOnFocusOutside,
				renderValue: selected.length ? () => null : void 0,
				onCreate,
				className,
				onEmptyBackspace: () => {
					const last = selected[selected.length - 1];
					if (last && !options.find((option) => option.value === last)?.disabled) apply(selected.slice(0, -1));
				}
			}),
			props.clearable && selected.some((value) => !isLocked(value)) && /* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "ghost",
				size: "xs",
				"data-slot": "combobox-clear",
				onClick: () => {
					refocus.current = null;
					apply(selected.filter(isLocked));
				},
				children: "Clear all"
			})
		]
	});
	const trigger = /* @__PURE__ */ jsx(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ jsxs("button", {
			ref: (node) => {
				triggerRef.current = node;
				if (typeof ref === "function") return ref(node);
				if (ref) ref.current = node;
			},
			...field,
			type: "button",
			role: "combobox",
			"data-size": "sm",
			"data-placeholder": selected.length ? void 0 : "",
			"aria-label": label,
			"aria-expanded": open,
			"aria-controls": open ? contentId : void 0,
			"aria-invalid": invalid || field["aria-invalid"] || void 0,
			disabled,
			onKeyDown: (event) => {
				if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
				event.preventDefault();
				changeOpen(true);
			},
			className: cn(controls_module_default.field, controls_module_default.trigger, mono && picker_module_default.mono, className),
			children: [/* @__PURE__ */ jsx("span", { children: selectedOption?.label ?? (selected[0] || placeholder) }), /* @__PURE__ */ jsx(Icon, {
				name: "chev-down",
				className: controls_module_default.chevron
			})]
		})
	});
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: (next) => {
			if (!disabled) changeOpen(next);
		},
		children: [
			trigger,
			/* @__PURE__ */ jsxs(PopoverContent, {
				id: contentId,
				align: "start",
				surface: "menu",
				onFocusOutside: (event) => {
					if (!closeOnFocusOutside) event.preventDefault();
				},
				children: [/* @__PURE__ */ jsxs(Command, {
					shouldFilter: false,
					children: [/* @__PURE__ */ jsx(CommandInput, {
						value: query,
						onValueChange: changeQuery,
						placeholder: "Search options",
						"aria-label": `Search ${label}`,
						onKeyDown: (event) => {
							if (event.nativeEvent.isComposing || event.keyCode === 229) event.stopPropagation();
						},
						trailing: loading ? /* @__PURE__ */ jsx(Spinner, {}) : void 0
					}), /* @__PURE__ */ jsxs(CommandList, {
						"aria-busy": loading || void 0,
						children: [
							props.clearable && !query && selected[0] && !isLocked(selected[0]) && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CommandGroup, { children: /* @__PURE__ */ jsxs(CommandItem, {
								value: "combobox-clear",
								"data-slot": "combobox-clear",
								onSelect: () => {
									apply([]);
									changeOpen(false);
								},
								children: [/* @__PURE__ */ jsx(Icon, { name: "x" }), /* @__PURE__ */ jsx("span", {
									className: menu_module_default.title,
									children: "Clear selection"
								})]
							}) }), /* @__PURE__ */ jsx(CommandSeparator, {})] }),
							!onSearch && !dialogCreation && /* @__PURE__ */ jsx(CommandEmpty, { children: emptyText }),
							(onSearch || dialogCreation) && !filtered.length && /* @__PURE__ */ jsx("p", {
								role: "status",
								"data-slot": "combobox-status",
								className: menu_module_default.empty,
								children: loading ? "Searching…" : emptyText
							}),
							/* @__PURE__ */ jsxs(CommandGroup, { children: [filtered.map((option) => /* @__PURE__ */ jsxs(CommandItem, {
								value: option.value,
								disabled: option.disabled || disabled,
								"data-checked": selected.includes(option.value),
								onSelect: () => {
									setPicked(option);
									apply([option.value]);
									changeOpen(false);
								},
								children: [/* @__PURE__ */ jsx("span", {
									className: menu_module_default.title,
									children: /* @__PURE__ */ jsx(Highlight, {
										text: option.label,
										query
									})
								}), option.meta && /* @__PURE__ */ jsx("span", {
									className: menu_module_default.meta,
									children: option.meta
								})]
							}, option.value)), canCreate && /* @__PURE__ */ jsxs(CommandItem, {
								disabled: creating || loading || disabled || Boolean(creationBlocked),
								value: `create:${query}`,
								onSelect: () => {
									creation.create(query.trim());
								},
								children: [/* @__PURE__ */ jsx("span", {
									className: menu_module_default.title,
									children: creating ? "Creating…" : `Create "${query.trim()}"`
								}), creationBlocked && /* @__PURE__ */ jsx("span", {
									className: menu_module_default.meta,
									children: creationBlocked
								})]
							})] }),
							dialogCreation && /* @__PURE__ */ jsxs(Fragment, { children: [filtered.length > 0 && /* @__PURE__ */ jsx(CommandSeparator, {}), /* @__PURE__ */ jsx(CommandGroup, { children: /* @__PURE__ */ jsxs(CommandItem, {
								value: "combobox-create-dialog",
								"data-slot": "combobox-create",
								disabled: disabled || Boolean(creationBlocked),
								onSelect: openDialog,
								children: [
									/* @__PURE__ */ jsx(Icon, { name: "plus" }),
									/* @__PURE__ */ jsx("span", {
										className: menu_module_default.title,
										children: dialogCreation.label
									}),
									creationBlocked && /* @__PURE__ */ jsx("span", {
										className: menu_module_default.meta,
										children: creationBlocked
									})
								]
							}) })] })
						]
					})]
				}), error && /* @__PURE__ */ jsx("p", {
					role: "alert",
					className: picker_module_default.error,
					children: error
				})]
			}),
			dialogCreation && session && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Dialog, {
				open: session.open,
				onOpenChange: (next) => {
					if (!next) guard.requestDiscard();
				},
				children: /* @__PURE__ */ jsxs(DialogContent, {
					pending: formPending,
					onSubmit: (event) => event.stopPropagation(),
					onCloseAutoFocus: (event) => {
						event.preventDefault();
						triggerRef.current?.focus();
					},
					children: [
						/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: dialogCreation.title }), dialogCreation.description && /* @__PURE__ */ jsx(DialogDescription, { children: dialogCreation.description })] }),
						/* @__PURE__ */ jsx(React.Fragment, { children: dialogCreation.renderForm({
							query: session.query,
							formId,
							complete: (option) => complete(session.id, option),
							dismiss: guard.requestDiscard,
							onDirtyChange: setFormDirty,
							onPendingChange: setFormPending,
							onSubmitLabelChange: setFormSubmitLabel
						}) }, session.id),
						/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
							variant: "outline",
							disabled: formPending,
							onClick: guard.requestDiscard,
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							form: formId,
							loading: formPending,
							children: formSubmitLabel ?? dialogCreation.submitLabel ?? "Create"
						})] })
					]
				})
			}), /* @__PURE__ */ jsx(DiscardChangesAlertDialog, {
				...guard.discardDialogProps,
				title: dialogCreation.discardTitle,
				description: dialogCreation.discardDescription
			})] })
		]
	});
}
Combobox.displayName = "Combobox";
var ComboboxInput = CommandInput;
var ComboboxContent = PopoverContent;
var ComboboxTrigger = PopoverTrigger;
var ComboboxList = CommandList;
var ComboboxItem = CommandItem;
var ComboboxEmpty = CommandEmpty;
var ComboboxGroup = CommandGroup;
var ComboboxSeparator = CommandSeparator;
function ComboboxLabel({ ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "combobox-label",
		...props
	});
}
ComboboxLabel.displayName = "ComboboxLabel";
var ComboboxValue = ComboboxLabel;
var ComboboxCollection = React.Fragment;
function ComboboxChips({ ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "combobox-chips",
		className: picker_module_default.chips,
		...props
	});
}
ComboboxChips.displayName = "ComboboxChips";
function ComboboxChip({ ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "combobox-chip",
		className: picker_module_default.chip,
		...props
	});
}
ComboboxChip.displayName = "ComboboxChip";
var ComboboxChipsInput = CommandInput;
var useComboboxAnchor = () => React.useRef(null);
export { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxSeparator, ComboboxTrigger, ComboboxValue, useComboboxAnchor };

//# sourceMappingURL=combobox.js.map