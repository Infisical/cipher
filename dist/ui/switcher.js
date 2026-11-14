import { CipherLink } from "../lib/link.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command.js";
import { Icon } from "./icon.js";
import { Kbd } from "./kbd.js";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "./popover.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/switcher.tsx
var SwitcherActionItem = ({ action, index, close }) => {
	const item = useRef(null);
	const clicked = useRef(false);
	const content = /* @__PURE__ */ jsxs(Fragment, { children: [
		action.icon && /* @__PURE__ */ jsx(Icon, { name: action.icon }),
		action.label,
		action.shortcut && /* @__PURE__ */ jsx(Kbd, { children: action.shortcut })
	] });
	const shared = {
		value: `action-${index}`,
		keywords: [action.label],
		disabled: action.disabled,
		"data-danger": action.danger || void 0
	};
	if (!action.link || action.disabled) return /* @__PURE__ */ jsx(CommandItem, {
		...shared,
		onSelect: () => {
			action.onSelect?.();
			close();
		},
		children: content
	});
	return /* @__PURE__ */ jsx(CommandItem, {
		...shared,
		ref: item,
		asChild: true,
		onSelect: () => {
			if (!clicked.current) item.current?.click();
			clicked.current = false;
			close();
		},
		children: /* @__PURE__ */ jsx(CipherLink, {
			link: action.link,
			tabIndex: -1,
			onClick: () => {
				clicked.current = true;
			},
			children: content
		})
	});
};
var syncActiveOption = (root) => {
	const list = root.querySelector("[cmdk-list]");
	const option = root.querySelector("[cmdk-item][data-selected=\"true\"]");
	if (option?.id) list?.setAttribute("aria-activedescendant", option.id);
	else list?.removeAttribute("aria-activedescendant");
};
var Switcher = ({ trigger, anchor, options, value, defaultValue = "", onChange, actions = [], header, footer, searchable = options.length > 7, placeholder = "Search", emptyText = "No matches", label, width = 280, maxHeight, align = "start", side = "bottom", open, defaultOpen = false, onOpenChange, className }) => {
	const [isOpen, setOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange
	});
	const [selected, setSelected] = useControllableState({
		value,
		defaultValue
	});
	const [query, setQuery] = useState("");
	const command = useRef(null);
	const optionObserver = useRef(null);
	const attachCommand = useCallback((node) => {
		optionObserver.current?.disconnect();
		command.current = node;
		if (node && !searchable) {
			const observer = new MutationObserver(() => syncActiveOption(node));
			observer.observe(node, {
				subtree: true,
				childList: true,
				attributes: true,
				attributeFilter: ["data-selected", "id"]
			});
			syncActiveOption(node);
			optionObserver.current = observer;
		}
	}, [searchable]);
	useEffect(() => {
		if (!isOpen) setQuery("");
	}, [isOpen]);
	const close = () => {
		setQuery("");
		setOpen(false);
	};
	const groups = [...new Set(options.map((option) => option.group ?? ""))];
	return /* @__PURE__ */ jsxs(Popover, {
		open: isOpen,
		onOpenChange: (next) => {
			setOpen(next);
			if (!next) setQuery("");
		},
		children: [anchor ? /* @__PURE__ */ jsx(PopoverAnchor, {
			asChild: true,
			children: anchor(/* @__PURE__ */ jsx(PopoverTrigger, {
				asChild: true,
				children: trigger
			}))
		}) : /* @__PURE__ */ jsx(PopoverTrigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsxs(PopoverContent, {
			className,
			align,
			side,
			"data-cipher-switcher": "",
			surface: "menu",
			style: { width },
			"aria-label": label,
			onOpenAutoFocus: (event) => {
				const target = command.current?.querySelector(searchable ? "[cmdk-input]" : "[cmdk-list]");
				if (target) {
					event.preventDefault();
					if (!searchable && command.current) syncActiveOption(command.current);
					target.focus();
				}
			},
			children: [
				header && /* @__PURE__ */ jsx("div", {
					className: "cipher-switcher-header",
					children: header
				}),
				/* @__PURE__ */ jsxs(Command, {
					ref: attachCommand,
					tabIndex: searchable ? void 0 : -1,
					shouldFilter: searchable,
					label,
					children: [
						searchable && /* @__PURE__ */ jsx(CommandInput, {
							placeholder,
							value: query,
							onValueChange: setQuery
						}),
						/* @__PURE__ */ jsx(CommandEmpty, { children: /* @__PURE__ */ jsx("p", {
							role: "status",
							children: emptyText
						}) }),
						/* @__PURE__ */ jsxs(CommandList, {
							tabIndex: -1,
							label,
							style: maxHeight === void 0 ? void 0 : { maxHeight },
							children: [
								groups.map((group) => /* @__PURE__ */ jsx(CommandGroup, {
									heading: group || void 0,
									children: options.filter((option) => (option.group ?? "") === group).map((option) => /* @__PURE__ */ jsxs(CommandItem, {
										value: option.value,
										keywords: [option.searchText ?? (typeof option.label === "string" ? option.label : option.value), ...option.keywords ?? []],
										disabled: option.disabled,
										"data-current": option.value === selected || void 0,
										"data-has-meta": option.meta ? "" : void 0,
										onSelect: () => {
											if (option.onSelect) option.onSelect();
											else if (option.value !== selected) {
												setSelected(option.value);
												onChange?.(option.value, option);
											}
											close();
										},
										children: [
											option.media,
											/* @__PURE__ */ jsxs("span", {
												className: option.mono ? "font-mono" : void 0,
												children: [option.label, option.description && /* @__PURE__ */ jsx("span", {
													className: "cipher-switcher-description",
													children: option.description
												})]
											}),
											option.meta && /* @__PURE__ */ jsx("span", {
												"data-switcher-meta": "",
												className: option.metaMono ? "ml-auto font-mono" : "ml-auto",
												children: option.meta
											}),
											option.value === selected && /* @__PURE__ */ jsx("span", {
												className: "inline-flex",
												children: /* @__PURE__ */ jsx(Icon, {
													name: "check",
													label: "Current"
												})
											})
										]
									}, option.value))
								}, group)),
								actions.length > 0 && options.length > 0 && /* @__PURE__ */ jsx(CommandSeparator, {}),
								actions.map((action, index) => "type" in action ? action.type === "separator" ? /* @__PURE__ */ jsx(CommandSeparator, {}, index) : /* @__PURE__ */ jsx(CommandGroup, { heading: action.label }, index) : /* @__PURE__ */ jsx(SwitcherActionItem, {
									action,
									index,
									close
								}, index))
							]
						})
					]
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "cipher-switcher-footer",
					children: typeof footer === "function" ? footer({ close }) : footer
				})
			]
		})]
	});
};
export { Switcher };

//# sourceMappingURL=switcher.js.map