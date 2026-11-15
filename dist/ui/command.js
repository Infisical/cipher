import { Dialog as Dialog$1, DialogContent, DialogDescription, DialogTitle } from "./dialog.js";
import { Icon } from "./icon.js";
import { ListHighlight } from "../lib/list-highlight.js";
import { cn } from "../lib/utils.js";
import { menuShortcutContent } from "./menu-content.js";
import { useMenuInset } from "./menu-inset.js";
import { ScrollBar } from "./scroll-area.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import overlay_module_default from "./overlay.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ScrollArea } from "radix-ui";
import { Command as Command$1 } from "cmdk";
// src/ui/command.tsx
function Command({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Command$1, {
		ref,
		"data-slot": "command",
		className: cn("flex size-full flex-col overflow-hidden text-foreground", className),
		...props
	});
}
Command.displayName = "Command";
function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, className, showCloseButton = false, onEscapeKeyDown, ...props }) {
	const opener = React.useRef(null);
	React.useLayoutEffect(() => {
		if (props.open) opener.current = document.activeElement;
	}, [props.open]);
	return /* @__PURE__ */ jsx(Dialog$1, {
		...props,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			"data-command-dialog": "",
			className: cn(overlay_module_default.palette, className),
			showCloseButton,
			onEscapeKeyDown,
			onCloseAutoFocus: (event) => {
				const target = opener.current;
				if (!(target instanceof HTMLElement) || !target.isConnected) return;
				event.preventDefault();
				target.focus();
			},
			children: [
				/* @__PURE__ */ jsx(DialogTitle, {
					className: "sr-only",
					children: title
				}),
				/* @__PURE__ */ jsx(DialogDescription, {
					className: "sr-only",
					children: description
				}),
				children
			]
		})
	});
}
function CommandInput({ className, trailing, ref, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "command-input-wrapper",
		className: controls_module_default.searchRow,
		children: [
			/* @__PURE__ */ jsx(Icon, { name: "search" }),
			/* @__PURE__ */ jsx(Command$1.Input, {
				ref,
				"data-slot": "command-input",
				className,
				...props
			}),
			trailing && /* @__PURE__ */ jsx("span", {
				"data-slot": "command-input-trailing",
				className: controls_module_default.searchTrailing,
				children: trailing
			})
		]
	});
}
CommandInput.displayName = "CommandInput";
function CommandList({ className, children, ref, style, ...props }) {
	const { maxHeight, ...listStyle } = style ?? {};
	const insetRef = useMenuInset(ref);
	return /* @__PURE__ */ jsxs(ScrollArea.Root, {
		"data-slot": "command-scroll",
		className: menu_module_default.scroll,
		style: maxHeight === void 0 ? void 0 : { maxHeight },
		children: [/* @__PURE__ */ jsx(ScrollArea.Viewport, {
			"data-scroll-fade": "y",
			className: menu_module_default.viewport,
			children: /* @__PURE__ */ jsxs(Command$1.List, {
				ref: insetRef,
				"data-slot": "command-list",
				className: cn(menu_module_default.inset, className),
				style: style ? listStyle : void 0,
				...props,
				children: [children, /* @__PURE__ */ jsx(ListHighlight, {})]
			})
		}), /* @__PURE__ */ jsx(ScrollBar, {})]
	});
}
CommandList.displayName = "CommandList";
function CommandEmpty({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Command$1.Empty, {
		ref,
		"data-slot": "command-empty",
		className: cn(menu_module_default.empty, className),
		...props
	});
}
CommandEmpty.displayName = "CommandEmpty";
function CommandGroup({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Command$1.Group, {
		ref,
		"data-slot": "command-group",
		className: cn(menu_module_default.group, className),
		...props
	});
}
CommandGroup.displayName = "CommandGroup";
function CommandSeparator({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Command$1.Separator, {
		ref,
		"data-slot": "command-separator",
		className: cn(menu_module_default.separator, className),
		...props
	});
}
CommandSeparator.displayName = "CommandSeparator";
function CommandItem({ className, children, ref, ...props }) {
	const checkable = props["data-checked"] !== void 0;
	return /* @__PURE__ */ jsx(Command$1.Item, {
		ref,
		"data-slot": "command-item",
		className: cn(menu_module_default.row, className),
		...props,
		children: checkable ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
			className: menu_module_default.indicator,
			"data-command": "",
			children: /* @__PURE__ */ jsx(Icon, { name: "check" })
		}), children] }) : children
	});
}
CommandItem.displayName = "CommandItem";
function CommandShortcut({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "command-shortcut",
		className: cn(menu_module_default.shortcut, className),
		...props,
		children: menuShortcutContent(children)
	});
}
CommandShortcut.displayName = "CommandShortcut";
export { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut };

//# sourceMappingURL=command.js.map