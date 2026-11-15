import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { MenuKindContext } from "../lib/menu-kind.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { menuRowContent, menuShortcutContent } from "./menu-content.js";
import { useMenuInset } from "./menu-inset.js";
import menu_module_default from "./menu.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ContextMenu as ContextMenu$1 } from "radix-ui";
// src/ui/context-menu.tsx
/**
* Whether a pointer has pressed inside the open menu. Radix selects the item under a pointerup that
* had no pointerdown on it, so the release of the opening right-click or long press would select
* whichever item the menu placed under the cursor. Items take pointer releases only after a press.
*/
var PressedSinceOpenContext = React.createContext(null);
function ContextMenu({ ...props }) {
	const pressedSinceOpen = React.useRef(false);
	return /* @__PURE__ */ jsx(PressedSinceOpenContext, {
		value: pressedSinceOpen,
		children: /* @__PURE__ */ jsx(ContextMenu$1.Root, {
			"data-slot": "context-menu",
			...props
		})
	});
}
function ContextMenuTrigger({ className, disabled, onKeyDown, onContextMenuCapture, ref, ...props }) {
	const pressedSinceOpen = React.useContext(PressedSinceOpenContext);
	return /* @__PURE__ */ jsx(ContextMenu$1.Trigger, {
		ref,
		"data-slot": "context-menu-trigger",
		className: cn("select-none", className),
		disabled,
		...props,
		onContextMenuCapture: (event) => {
			onContextMenuCapture?.(event);
			if (pressedSinceOpen) pressedSinceOpen.current = false;
		},
		onKeyDown: (event) => {
			onKeyDown?.(event);
			if (event.defaultPrevented || disabled || event.repeat) return;
			if (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10")) return;
			event.preventDefault();
			const rect = event.currentTarget.getBoundingClientRect();
			event.currentTarget.dispatchEvent(new MouseEvent("contextmenu", {
				bubbles: true,
				cancelable: true,
				clientX: rect.left + rect.width / 2,
				clientY: rect.top + rect.height / 2
			}));
		}
	});
}
ContextMenuTrigger.displayName = "ContextMenuTrigger";
function ContextMenuGroup({ ref, ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Group, {
		ref,
		"data-slot": "context-menu-group",
		...props
	});
}
ContextMenuGroup.displayName = "ContextMenuGroup";
function ContextMenuPortal({ ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Portal, {
		container: usePortalContainer(),
		"data-slot": "context-menu-portal",
		...props
	});
}
function ContextMenuSub({ ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Sub, {
		"data-slot": "context-menu-sub",
		...props
	});
}
function ContextMenuRadioGroup({ ref, ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.RadioGroup, {
		ref,
		"data-slot": "context-menu-radio-group",
		...props
	});
}
ContextMenuRadioGroup.displayName = "ContextMenuRadioGroup";
function ContextMenuContent({ className, children, collisionPadding = 8, onPointerDownCapture, onPointerUpCapture, ref, ...props }) {
	const pressedSinceOpen = React.useContext(PressedSinceOpenContext);
	const insetRef = useMenuInset(ref);
	return /* @__PURE__ */ jsx(ContextMenu$1.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(ContextMenu$1.Content, {
			ref: insetRef,
			"data-slot": "context-menu-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			className: cn("z-50", menu_module_default.surface, menu_module_default.panel, menu_module_default.inset, menu_module_default.motion, className),
			"data-scroll-fade": "y",
			...props,
			onPointerDownCapture: (event) => {
				onPointerDownCapture?.(event);
				if (pressedSinceOpen) pressedSinceOpen.current = true;
			},
			onPointerUpCapture: (event) => {
				onPointerUpCapture?.(event);
				if (pressedSinceOpen && !pressedSinceOpen.current) event.preventDefault();
			},
			children: [/* @__PURE__ */ jsx(MenuKindContext, {
				value: "context",
				children
			}), /* @__PURE__ */ jsx(ListHighlight, {})]
		})
	});
}
ContextMenuContent.displayName = "ContextMenuContent";
function ContextMenuItem({ className, inset, variant = "default", children, description, ref, ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Item, {
		ref,
		"data-slot": "context-menu-item",
		"data-inset": inset,
		"data-variant": variant,
		className: cn(menu_module_default.row, className),
		...props,
		children: menuRowContent(children, description)
	});
}
ContextMenuItem.displayName = "ContextMenuItem";
function ContextMenuSubTrigger({ className, inset, children, ref, ...props }) {
	return /* @__PURE__ */ jsxs(ContextMenu$1.SubTrigger, {
		ref,
		"data-slot": "context-menu-sub-trigger",
		"data-inset": inset,
		className: cn(menu_module_default.row, className),
		...props,
		children: [menuRowContent(children), /* @__PURE__ */ jsx(Icon, {
			name: "chev-right",
			className: menu_module_default.trail
		})]
	});
}
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger";
function ContextMenuSubContent({ className, children, collisionPadding = 8, sideOffset = 4, alignOffset = -3, ref, ...props }) {
	const insetRef = useMenuInset(ref);
	return /* @__PURE__ */ jsx(ContextMenu$1.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(ContextMenu$1.SubContent, {
			ref: insetRef,
			"data-slot": "context-menu-sub-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			sideOffset,
			alignOffset,
			className: cn("z-50", menu_module_default.surface, menu_module_default.panel, menu_module_default.sub, menu_module_default.inset, menu_module_default.motion, className),
			"data-scroll-fade": "y",
			...props,
			children: [/* @__PURE__ */ jsx(MenuKindContext, {
				value: "context",
				children
			}), /* @__PURE__ */ jsx(ListHighlight, {})]
		})
	});
}
ContextMenuSubContent.displayName = "ContextMenuSubContent";
function ContextMenuCheckboxItem({ className, children, description, checked, inset, onSelect, closeOnSelect = false, ref, ...props }) {
	return /* @__PURE__ */ jsxs(ContextMenu$1.CheckboxItem, {
		ref,
		"data-slot": "context-menu-checkbox-item",
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
			children: /* @__PURE__ */ jsx(ContextMenu$1.ItemIndicator, { children: /* @__PURE__ */ jsx(Icon, { name: "check" }) })
		}), menuRowContent(children, description)]
	});
}
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";
function ContextMenuRadioItem({ className, children, description, inset, onSelect, closeOnSelect = false, ref, ...props }) {
	return /* @__PURE__ */ jsxs(ContextMenu$1.RadioItem, {
		ref,
		"data-slot": "context-menu-radio-item",
		"data-inset": inset,
		className: cn(menu_module_default.row, className),
		...props,
		onSelect: (event) => {
			onSelect?.(event);
			if (!closeOnSelect) event.preventDefault();
		},
		children: [/* @__PURE__ */ jsx("span", {
			className: menu_module_default.indicator,
			children: /* @__PURE__ */ jsx(ContextMenu$1.ItemIndicator, { children: /* @__PURE__ */ jsx(Icon, { name: "check" }) })
		}), menuRowContent(children, description)]
	});
}
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";
function ContextMenuLabel({ className, inset, ref, ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Label, {
		ref,
		"data-slot": "context-menu-label",
		"data-inset": inset,
		className: cn(menu_module_default.label, className),
		...props
	});
}
ContextMenuLabel.displayName = "ContextMenuLabel";
function ContextMenuSeparator({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(ContextMenu$1.Separator, {
		ref,
		"data-slot": "context-menu-separator",
		className: cn(menu_module_default.separator, className),
		...props
	});
}
ContextMenuSeparator.displayName = "ContextMenuSeparator";
function ContextMenuShortcut({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "context-menu-shortcut",
		className: cn(menu_module_default.shortcut, className),
		...props,
		children: menuShortcutContent(children)
	});
}
ContextMenuShortcut.displayName = "ContextMenuShortcut";
export { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuGroup, ContextMenuItem, ContextMenuLabel, ContextMenuPortal, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger };

//# sourceMappingURL=context-menu.js.map