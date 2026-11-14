import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { useMenuPrimitive } from "../lib/menu-kind.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { menuRowContent, menuShortcutContent } from "./menu-content.js";
import { useMenuInset } from "./menu-inset.js";
import menu_module_default from "./menu.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { DropdownMenu as DropdownMenu$1 } from "radix-ui";
// src/ui/dropdown-menu.tsx
function DropdownMenu({ ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenu$1.Root, {
		"data-slot": "dropdown-menu",
		...props
	});
}
function DropdownMenuPortal({ ...props }) {
	return /* @__PURE__ */ jsx(DropdownMenu$1.Portal, {
		container: usePortalContainer(),
		"data-slot": "dropdown-menu-portal",
		...props
	});
}
function DropdownMenuTrigger({ className, asChild, children, ref, ...props }) {
	return asChild ? /* @__PURE__ */ jsx(DropdownMenu$1.Trigger, {
		ref,
		asChild: true,
		"data-slot": "dropdown-menu-trigger",
		className,
		...props,
		children
	}) : /* @__PURE__ */ jsx(DropdownMenu$1.Trigger, {
		ref,
		asChild: true,
		"data-slot": "dropdown-menu-trigger",
		...props,
		children: /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "outline",
			className,
			children
		})
	});
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
function DropdownMenuContent({ className, children, collisionPadding = 8, align = "start", sideOffset = 4, ref, ...props }) {
	const insetRef = useMenuInset(ref);
	return /* @__PURE__ */ jsx(DropdownMenu$1.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(DropdownMenu$1.Content, {
			ref: insetRef,
			"data-slot": "dropdown-menu-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			sideOffset,
			align,
			className: cn("z-50", menu_module_default.surface, menu_module_default.panel, menu_module_default.inset, menu_module_default.motion, className),
			"data-scroll-fade": "y",
			...props,
			children: [children, /* @__PURE__ */ jsx(ListHighlight, {})]
		})
	});
}
DropdownMenuContent.displayName = "DropdownMenuContent";
function DropdownMenuGroup({ ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsx(Primitive.Group, {
		ref,
		"data-slot": "dropdown-menu-group",
		...props
	});
}
DropdownMenuGroup.displayName = "DropdownMenuGroup";
function DropdownMenuItem({ className, inset, variant = "default", description, disabledReason, onSelect, onClick, children, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	const reason = disabledReason || void 0;
	const rowDescription = reason ? /* @__PURE__ */ jsx("span", {
		"aria-hidden": true,
		children: reason
	}) : description;
	const slotted = props.asChild && React.isValidElement(children) ? children : null;
	return /* @__PURE__ */ jsx(Primitive.Item, {
		ref,
		"data-slot": "dropdown-menu-item",
		"data-inset": inset,
		"data-variant": variant,
		"data-disabled-reason": reason ? "" : void 0,
		className: cn(menu_module_default.row, className),
		...props,
		"aria-disabled": reason ? true : props["aria-disabled"],
		"aria-description": reason ?? props["aria-description"],
		onClick: (event) => {
			if (reason) event.preventDefault();
			onClick?.(event);
		},
		onSelect: (event) => {
			if (reason) {
				event.preventDefault();
				return;
			}
			onSelect?.(event);
		},
		children: slotted ? React.cloneElement(slotted, void 0, menuRowContent(slotted.props.children, rowDescription)) : menuRowContent(children, rowDescription)
	});
}
DropdownMenuItem.displayName = "DropdownMenuItem";
function DropdownMenuCheckboxItem({ className, children, description, checked, inset, onSelect, closeOnSelect = false, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsxs(Primitive.CheckboxItem, {
		ref,
		"data-slot": "dropdown-menu-checkbox-item",
		"data-inset": inset,
		className: cn(menu_module_default.row, className),
		checked,
		...props,
		onSelect: (event) => {
			onSelect?.(event);
			if (!closeOnSelect) event.preventDefault();
		},
		children: [/* @__PURE__ */ jsx("span", {
			className: menu_module_default.indicator,
			"data-slot": "dropdown-menu-checkbox-item-indicator",
			children: /* @__PURE__ */ jsx(Primitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Icon, { name: "check" }) })
		}), menuRowContent(children, description)]
	});
}
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
function DropdownMenuRadioGroup({ ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsx(Primitive.RadioGroup, {
		ref,
		"data-slot": "dropdown-menu-radio-group",
		...props
	});
}
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";
function DropdownMenuRadioItem({ className, children, description, inset, onSelect, closeOnSelect = false, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsxs(Primitive.RadioItem, {
		ref,
		"data-slot": "dropdown-menu-radio-item",
		"data-inset": inset,
		className: cn(menu_module_default.row, className),
		...props,
		onSelect: (event) => {
			onSelect?.(event);
			if (!closeOnSelect) event.preventDefault();
		},
		children: [/* @__PURE__ */ jsx("span", {
			className: menu_module_default.indicator,
			"data-slot": "dropdown-menu-radio-item-indicator",
			children: /* @__PURE__ */ jsx(Primitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Icon, { name: "check" }) })
		}), menuRowContent(children, description)]
	});
}
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
function DropdownMenuLabel({ className, inset, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsx(Primitive.Label, {
		ref,
		"data-slot": "dropdown-menu-label",
		"data-inset": inset,
		className: cn(menu_module_default.label, className),
		...props
	});
}
DropdownMenuLabel.displayName = "DropdownMenuLabel";
function DropdownMenuSeparator({ className, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsx(Primitive.Separator, {
		ref,
		"data-slot": "dropdown-menu-separator",
		className: cn(menu_module_default.separator, className),
		...props
	});
}
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
function DropdownMenuShortcut({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "dropdown-menu-shortcut",
		className: cn(menu_module_default.shortcut, className),
		...props,
		children: menuShortcutContent(children)
	});
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function DropdownMenuSub({ ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsx(Primitive.Sub, {
		"data-slot": "dropdown-menu-sub",
		...props
	});
}
function DropdownMenuSubTrigger({ className, inset, children, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	return /* @__PURE__ */ jsxs(Primitive.SubTrigger, {
		ref,
		"data-slot": "dropdown-menu-sub-trigger",
		"data-inset": inset,
		className: cn(menu_module_default.row, className),
		...props,
		children: [menuRowContent(children), /* @__PURE__ */ jsx(Icon, {
			name: "chev-right",
			className: menu_module_default.trail
		})]
	});
}
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";
function DropdownMenuSubContent({ className, children, collisionPadding = 8, sideOffset = 4, alignOffset = -3, ref, ...props }) {
	const Primitive = useMenuPrimitive();
	const insetRef = useMenuInset(ref);
	return /* @__PURE__ */ jsx(Primitive.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(Primitive.SubContent, {
			ref: insetRef,
			"data-slot": "dropdown-menu-sub-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			sideOffset,
			alignOffset,
			className: cn("z-50", menu_module_default.surface, menu_module_default.panel, menu_module_default.sub, menu_module_default.inset, menu_module_default.motion, className),
			"data-scroll-fade": "y",
			...props,
			children: [children, /* @__PURE__ */ jsx(ListHighlight, {})]
		})
	});
}
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
export { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger };

//# sourceMappingURL=dropdown-menu.js.map