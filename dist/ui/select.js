"use client";
import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { assignRef } from "../lib/descendant-flags.js";
import { isDev } from "../lib/dev.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { useMenuInset } from "./menu-inset.js";
import { Tooltip as Tooltip$1 } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Select as Select$1 } from "radix-ui";
// src/ui/select.tsx
var SelectSettingsContext = React.createContext({ wrap: false });
var descriptionLayoutWarned = false;
function useDescriptionLayoutWarning(descriptionLayout) {
	React.useEffect(() => {
		if (!isDev || descriptionLayout === void 0 || descriptionLayoutWarned) return;
		descriptionLayoutWarned = true;
		console.warn("Select: descriptionLayout is deprecated and ignored. Descriptions always stack under the label. Pass short values such as a count, region or version as meta instead.");
	}, [descriptionLayout]);
}
function titleIfTruncated(element) {
	if (!element) return;
	const text = element.querySelector("[data-slot=\"option-text\"]") ?? element;
	if (text.scrollWidth > text.clientWidth || element.scrollWidth > element.clientWidth) element.title = text.textContent ?? "";
	else element.removeAttribute("title");
}
var SelectNameContext = React.createContext({});
var SelectRootContext = React.createContext({ open: false });
function Select({ options, label, placeholder = "Choose an option", size, width, invalid, align = "start", menuWidth, icon, wrap, descriptionLayout, disabledReason, disabled, open: openProp, defaultOpen, onOpenChange, onChange, onValueChange, children, id, "aria-describedby": describedBy, "aria-label": ariaLabel, "aria-labelledby": labelledBy, ...props }) {
	useDescriptionLayoutWarning(descriptionLayout);
	const groups = [...new Set(options?.map((option) => option.group ?? ""))];
	const [localOpen, setLocalOpen] = React.useState(defaultOpen ?? false);
	const [triggerReason, setTriggerReason] = React.useState();
	const reason = disabledReason || triggerReason || void 0;
	if (reason && localOpen) setLocalOpen(false);
	const open = !reason && (openProp ?? localOpen);
	return /* @__PURE__ */ jsx(Select$1.Root, {
		"data-slot": "select",
		open,
		onOpenChange: (next) => {
			setLocalOpen(next);
			onOpenChange?.(next);
		},
		onValueChange: (value) => {
			if (reason) return;
			onValueChange?.(value);
			onChange?.(value);
		},
		disabled: reason ? void 0 : disabled,
		...props,
		children: /* @__PURE__ */ jsx(SelectRootContext, {
			value: {
				open,
				disabledReason: reason,
				setTriggerReason
			},
			children: /* @__PURE__ */ jsx(SelectSettingsContext, {
				value: { wrap: wrap ?? false },
				children: options ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(SelectTrigger, {
					id,
					size: size ?? "default",
					icon,
					width,
					disabledReason,
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
						meta: option.meta,
						badge: option.badge,
						media: option.media,
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
function SelectTrigger({ className, size = "default", icon, width, disabledReason, children, onPointerEnter, onFocus, onPointerDown, onClick, onKeyDown, ref, ...props }) {
	const name = React.useContext(SelectNameContext);
	const fieldAttributes = useFieldControlAttributes({
		...props,
		"aria-labelledby": props["aria-labelledby"] ?? name["aria-labelledby"]
	});
	const reasonId = React.useId();
	const root = React.useContext(SelectRootContext);
	const reason = (disabledReason ?? root.disabledReason) || void 0;
	const { setTriggerReason } = root;
	React.useLayoutEffect(() => {
		if (!disabledReason || !setTriggerReason) return void 0;
		setTriggerReason(disabledReason);
		return () => setTriggerReason(void 0);
	}, [disabledReason, setTriggerReason]);
	const [tipOpen, setTipOpen] = React.useState(false);
	if (!reason && tipOpen) setTipOpen(false);
	const trigger = /* @__PURE__ */ jsxs(Select$1.Trigger, {
		ref,
		"data-slot": "select-trigger",
		"data-state": root.open ? "open" : "closed",
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
		disabled: reason ? void 0 : props.disabled,
		"aria-disabled": reason ? true : props["aria-disabled"],
		"aria-describedby": [fieldAttributes["aria-describedby"], reason && reasonId].filter(Boolean).join(" ") || void 0,
		onPointerDown: (event) => {
			onPointerDown?.(event);
			if (reason) event.preventDefault();
		},
		onClick: (event) => {
			onClick?.(event);
			if (reason) event.preventDefault();
		},
		onKeyDown: (event) => {
			onKeyDown?.(event);
			const typeahead = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
			if (reason && (typeahead || [
				"Enter",
				"ArrowUp",
				"ArrowDown"
			].includes(event.key))) event.preventDefault();
		},
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Tooltip$1, {
		content: reason || " ",
		open: Boolean(reason) && tipOpen,
		onOpenChange: setTipOpen,
		children: trigger
	}), reason && /* @__PURE__ */ jsx("span", {
		id: reasonId,
		className: "sr-only",
		children: reason
	})] });
}
SelectTrigger.displayName = "SelectTrigger";
function SelectContent({ className, collisionPadding = 16, children, align = "start", sideOffset = 4, style, wrap, descriptionLayout, ref, ...props }) {
	const inset = useMenuInset();
	const inherited = React.useContext(SelectSettingsContext);
	useDescriptionLayoutWarning(descriptionLayout);
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
					children: [/* @__PURE__ */ jsx(SelectSettingsContext, {
						value: { wrap: wrap ?? inherited.wrap },
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
function SelectItem({ className, children, description, meta, badge, media, wrap, onFocus, "aria-describedby": describedBy, ref, ...props }) {
	const descriptionId = React.useId();
	const metaId = React.useId();
	const hasMeta = meta != null && meta !== false && meta !== "";
	const label = React.useRef(null);
	const inherited = React.useContext(SelectSettingsContext);
	const wrapped = wrap ?? inherited.wrap;
	React.useLayoutEffect(() => {
		const node = label.current;
		if (node?.title && node.title !== node.textContent) titleIfTruncated(node);
	});
	const labelText = /* @__PURE__ */ jsx("span", {
		ref: label,
		className: picker_module_default.optionLabel,
		onPointerEnter: (event) => titleIfTruncated(event.currentTarget),
		children: /* @__PURE__ */ jsx(Select$1.ItemText, { children: badge === void 0 && !media ? children : /* @__PURE__ */ jsxs(Fragment, { children: [
			Boolean(media) && /* @__PURE__ */ jsx("span", {
				"data-slot": "option-media",
				className: cn(picker_module_default.optionMedia, "cipher-lead-line"),
				children: media
			}),
			/* @__PURE__ */ jsx("span", {
				"data-slot": "option-text",
				children
			}),
			badge
		] }) })
	});
	return /* @__PURE__ */ jsxs(Select$1.Item, {
		ref,
		"data-slot": "select-item",
		"aria-describedby": [
			describedBy,
			description && descriptionId,
			hasMeta && metaId
		].filter(Boolean).join(" ") || void 0,
		"data-wrap": wrapped || void 0,
		"data-description": description ? "stacked" : void 0,
		className: cn(menu_module_default.row, picker_module_default.option, className),
		onFocus: (event) => {
			onFocus?.(event);
			titleIfTruncated(label.current);
		},
		...props,
		children: [
			description ? /* @__PURE__ */ jsxs("span", {
				className: menu_module_default.text,
				children: [labelText, /* @__PURE__ */ jsx("span", {
					id: descriptionId,
					className: cn(menu_module_default.description, picker_module_default.optionDescription),
					children: description
				})]
			}) : labelText,
			hasMeta && /* @__PURE__ */ jsx("span", {
				id: metaId,
				className: picker_module_default.optionMeta,
				children: meta
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
/**
* Radix shows a scroll button for any overflow at all, so a list whose height lands on a fractional
* pixel at some zoom levels gets a chevron with nothing to scroll. Radix keeps that decision
* private, so its button stays mounted and is hidden until more than a pixel is left to scroll.
* A list that fits once the shown buttons give their height back hides both, because the buttons
* would otherwise keep a list that briefly overflowed while opening scrollable for good.
*/
function useScrollButtonOverflow(edge, ref, style) {
	const [node, setNode] = React.useState(null);
	const [overflows, setOverflows] = React.useState(false);
	React.useLayoutEffect(() => {
		const viewport = node?.parentElement?.querySelector("[data-radix-select-viewport]");
		const menu = node?.parentElement;
		if (!viewport || !menu) return void 0;
		const update = () => {
			const buttons = Array.from(menu.querySelectorAll(":scope > [data-slot^='select-scroll-']")).reduce((height, button) => height + button.offsetHeight, 0);
			const overflow = viewport.scrollHeight - viewport.clientHeight;
			const remaining = edge === "start" ? viewport.scrollTop : overflow - viewport.scrollTop;
			setOverflows(overflow - buttons > 1 && remaining > 1);
		};
		const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
		const observeRows = () => {
			resize?.observe(viewport);
			Array.from(viewport.children).forEach((child) => resize?.observe(child));
		};
		update();
		observeRows();
		const frame = requestAnimationFrame(update);
		viewport.addEventListener("scroll", update);
		menu.addEventListener("animationend", update);
		menu.addEventListener("transitionend", update);
		const content = new MutationObserver(() => {
			observeRows();
			update();
		});
		content.observe(viewport, {
			childList: true,
			subtree: true,
			characterData: true
		});
		return () => {
			cancelAnimationFrame(frame);
			viewport.removeEventListener("scroll", update);
			menu.removeEventListener("animationend", update);
			menu.removeEventListener("transitionend", update);
			resize?.disconnect();
			content.disconnect();
		};
	}, [node, edge]);
	React.useLayoutEffect(() => {
		const active = document.activeElement;
		if (overflows && active instanceof HTMLElement && node?.parentElement?.contains(active)) active.scrollIntoView({ block: "nearest" });
	}, [overflows, node]);
	return {
		ref: React.useCallback((element) => {
			setNode(element);
			const cleanup = typeof ref === "function" ? ref(element) : void 0;
			if (ref && typeof ref !== "function") ref.current = element;
			return () => {
				setNode(null);
				if (cleanup) cleanup();
				else assignRef(ref, null);
			};
		}, [ref]),
		style: overflows ? style : {
			...style,
			display: "none"
		}
	};
}
function SelectScrollUpButton({ className, style, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.ScrollUpButton, {
		...useScrollButtonOverflow("start", ref, style),
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
function SelectScrollDownButton({ className, style, ref, ...props }) {
	return /* @__PURE__ */ jsx(Select$1.ScrollDownButton, {
		...useScrollButtonOverflow("end", ref, style),
		"data-slot": "select-scroll-down-button",
		className: cn("z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4", className),
		...props,
		children: /* @__PURE__ */ jsx(Icon, { name: "chev-down" })
	});
}
SelectScrollDownButton.displayName = "SelectScrollDownButton";
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };

//# sourceMappingURL=select.js.map