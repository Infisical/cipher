import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { useMenuInset } from "./menu-inset.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Select as Select$1 } from "radix-ui";
// src/ui/select.tsx
var SelectWrapContext = React.createContext(false);
function titleIfTruncated(element) {
	if (!element) return;
	if (element.scrollWidth > element.clientWidth) element.title = element.textContent ?? "";
	else element.removeAttribute("title");
}
var SelectNameContext = React.createContext({});
function Select({ options, label, placeholder = "Choose an option", size, width, invalid, align = "start", menuWidth, icon, wrap, onChange, onValueChange, children, id, "aria-describedby": describedBy, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }) {
	const groups = [...new Set(options?.map((option) => option.group ?? ""))];
	return /* @__PURE__ */ jsx(Select$1.Root, {
		"data-slot": "select",
		onValueChange: (value) => {
			onValueChange?.(value);
			onChange?.(value);
		},
		...props,
		children: /* @__PURE__ */ jsx(SelectWrapContext, {
			value: wrap ?? false,
			children: options ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SelectTrigger, {
				id,
				size: size ?? "default",
				icon,
				width,
				"aria-label": ariaLabel ?? label,
				"aria-labelledby": labelledBy,
				"aria-describedby": describedBy,
				"aria-invalid": invalid || void 0,
				children: /* @__PURE__ */ jsx(SelectValue, { placeholder })
			}), /* @__PURE__ */ jsx(SelectContent, {
				align,
				style: menuWidth ? {
					width: menuWidth,
					maxWidth: "var(--radix-select-content-available-width)"
				} : void 0,
				children: groups.map((group) => /* @__PURE__ */ jsxs(SelectGroup, { children: [group && /* @__PURE__ */ jsx(SelectLabel, { children: group }), options.filter((option) => (option.group ?? "") === group).map((option) => /* @__PURE__ */ jsx(SelectItem, {
					value: option.value,
					disabled: option.disabled,
					description: option.description,
					children: /* @__PURE__ */ jsx("span", {
						"data-slot": "select-option-label",
						children: option.label
					})
				}, option.value))] }, group))
			})] }) : /* @__PURE__ */ jsx(SelectNameContext, {
				value: {
					"aria-label": ariaLabel,
					"aria-labelledby": labelledBy
				},
				children
			})
		})
	});
}
function SelectGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.Group, {
		ref,
		"data-slot": "select-group",
		className,
		...props
	});
}
SelectGroup.displayName = "SelectGroup";
function SelectValue({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.Value, {
		ref,
		"data-slot": "select-value",
		...props
	});
}
SelectValue.displayName = "SelectValue";
function SelectTrigger({ className, size = "default", icon, width, children, onPointerEnter, onFocus, ref, ...props }) {
	const name = React.useContext(SelectNameContext);
	const fieldAttributes = useFieldControlAttributes({
		...props,
		"aria-labelledby": props["aria-labelledby"] ?? name["aria-labelledby"]
	});
	return /* @__PURE__ */ jsxs(Select$1.Trigger, {
		ref,
		"data-slot": "select-trigger",
		"data-size": size,
		"data-width": width,
		className: cn(controls_module_default.field, controls_module_default.trigger, controls_module_default.triggerHover, "[&_svg]:pointer-events-none [&_svg]:shrink-0", controls_module_default.selectTrigger, className),
		"aria-label": name["aria-label"],
		onPointerEnter: (event) => {
			onPointerEnter?.(event);
			titleIfTruncated(event.currentTarget.querySelector("[data-slot=\"select-value\"]"));
		},
		onFocus: (event) => {
			onFocus?.(event);
			titleIfTruncated(event.currentTarget.querySelector("[data-slot=\"select-value\"]"));
		},
		...props,
		...fieldAttributes,
		children: [
			icon && /* @__PURE__ */ jsx("span", {
				className: controls_module_default.leading,
				"data-slot": "select-icon",
				children: /* @__PURE__ */ jsx(Icon, { icon })
			}),
			children,
			/* @__PURE__ */ jsx(Select$1.Icon, {
				asChild: true,
				children: /* @__PURE__ */ jsx(Icon, {
					name: "chev-down",
					className: controls_module_default.chevron
				})
			})
		]
	});
}
SelectTrigger.displayName = "SelectTrigger";
function SelectContent({ className, collisionPadding = 8, children, align = "start", sideOffset = 4, style, wrap, ref, ...props }) {
	const inset = useMenuInset();
	const inherited = React.useContext(SelectWrapContext);
	return /* @__PURE__ */ jsx(Select$1.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(Select$1.Content, {
			ref,
			"data-slot": "select-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			className: cn("relative z-50", menu_module_default.surface, menu_module_default.panel, menu_module_default.motion, className),
			position: "popper",
			align,
			sideOffset,
			style: {
				width: "var(--radix-select-trigger-width)",
				...style
			},
			...props,
			children: [
				/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
				/* @__PURE__ */ jsxs(Select$1.Viewport, {
					ref: inset,
					className: menu_module_default.inset,
					"data-scroll-fade": "y",
					children: [/* @__PURE__ */ jsx(SelectWrapContext, {
						value: wrap ?? inherited,
						children
					}), /* @__PURE__ */ jsx(ListHighlight, {})]
				}),
				/* @__PURE__ */ jsx(SelectScrollDownButton, {})
			]
		})
	});
}
SelectContent.displayName = "SelectContent";
function SelectLabel({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.Label, {
		ref,
		"data-slot": "select-label",
		className: cn(menu_module_default.label, className),
		...props
	});
}
SelectLabel.displayName = "SelectLabel";
function SelectItem({ className, children, description, wrap, onFocus, "aria-describedby": describedBy, ref, ...props }) {
	const descriptionId = React.useId();
	const label = React.useRef(null);
	const inherited = React.useContext(SelectWrapContext);
	const wrapped = wrap ?? inherited;
	React.useLayoutEffect(() => {
		const node = label.current;
		if (node?.title && node.title !== node.textContent) titleIfTruncated(node);
	});
	return /* @__PURE__ */ jsxs(Select$1.Item, {
		ref,
		"data-slot": "select-item",
		"aria-describedby": [describedBy, description ? descriptionId : void 0].filter(Boolean).join(" ") || void 0,
		"data-wrap": wrapped || void 0,
		className: cn(menu_module_default.row, picker_module_default.option, className),
		onFocus: (event) => {
			onFocus?.(event);
			titleIfTruncated(label.current);
		},
		...props,
		children: [
			/* @__PURE__ */ jsx("span", {
				ref: label,
				className: picker_module_default.optionLabel,
				onPointerEnter: (event) => titleIfTruncated(event.currentTarget),
				children: /* @__PURE__ */ jsx(Select$1.ItemText, { children })
			}),
			description && /* @__PURE__ */ jsx("span", {
				id: descriptionId,
				className: picker_module_default.optionMeta,
				children: description
			}),
			/* @__PURE__ */ jsx("span", {
				className: picker_module_default.optionCheck,
				children: /* @__PURE__ */ jsx(Select$1.ItemIndicator, { children: /* @__PURE__ */ jsx(Icon, { name: "check" }) })
			})
		]
	});
}
SelectItem.displayName = "SelectItem";
function SelectSeparator({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.Separator, {
		ref,
		"data-slot": "select-separator",
		className: cn(menu_module_default.separator, className),
		...props
	});
}
SelectSeparator.displayName = "SelectSeparator";
function SelectScrollUpButton({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.ScrollUpButton, {
		ref,
		"data-slot": "select-scroll-up-button",
		className: cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(Icon, {
			name: "chev-down",
			className: "rotate-180"
		})
	});
}
SelectScrollUpButton.displayName = "SelectScrollUpButton";
function SelectScrollDownButton({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.ScrollDownButton, {
		ref,
		"data-slot": "select-scroll-down-button",
		className: cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(Icon, { name: "chev-down" })
	});
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };

//# sourceMappingURL=select.js.map