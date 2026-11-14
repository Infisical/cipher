import { ListHighlight } from "../lib/list-highlight.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { cn } from "../lib/utils.js";
import { FieldHelp } from "./field.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { useMenuInset } from "./menu-inset.js";
import { Popover, PopoverAnchor, PopoverContent } from "./popover.js";
import helpers_module_default from "./helpers.module.js";
import menu_module_default from "./menu.module.js";
import picker_module_default from "./picker.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/secret-path-input.tsx
var GLOB = /[*?[\]{}]/;
var splitPath = (path) => {
	const cut = path.lastIndexOf("/");
	return {
		parent: cut <= 0 ? "/" : path.slice(0, cut),
		segment: path.slice(cut + 1)
	};
};
function SecretPathInput({ value: valueProp, defaultValue = "/", onChange, folders = [], onParentPathChange, mono = true, disabled, readOnly, onFocus, onBlur, onKeyDown, ref, ...props }) {
	const [value, setValue] = useControllableState({
		value: valueProp,
		defaultValue,
		onChange
	});
	const { parent, segment } = splitPath(value);
	const report = React.useEffectEvent((next) => onParentPathChange?.(next));
	React.useEffect(() => {
		report(parent);
	}, [parent]);
	const [focused, setFocused] = React.useState(false);
	const [dismissed, setDismissed] = React.useState(false);
	const [active, setActive] = React.useState(-1);
	const anchor = React.useRef(null);
	const list = React.useRef(null);
	const listInset = useMenuInset(list);
	const listId = React.useId();
	const optionId = (index) => `${listId}-${index}`;
	const typed = segment.toLowerCase();
	const suggestions = GLOB.test(value) ? [] : [...new Set(folders)].filter((name) => name.toLowerCase().startsWith(typed)).sort((a, b) => a.localeCompare(b, void 0, { sensitivity: "base" }));
	const open = focused && !dismissed && !disabled && !readOnly && suggestions.length > 0;
	const current = open && active < suggestions.length ? active : -1;
	React.useEffect(() => {
		if (current >= 0) document.getElementById(optionId(current))?.scrollIntoView({ block: "nearest" });
	});
	const change = (next) => {
		setValue(next);
		setDismissed(false);
		setActive(-1);
	};
	const choose = (name) => change(`${parent === "/" ? "" : parent}/${name}/`);
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: (next) => {
			if (!next) setDismissed(true);
		},
		children: [/* @__PURE__ */ jsx(PopoverAnchor, {
			asChild: true,
			children: /* @__PURE__ */ jsx("div", {
				ref: anchor,
				"data-slot": "secret-path-input",
				className: picker_module_default.pathAnchor,
				children: /* @__PURE__ */ jsx(Input, {
					ref,
					...props,
					type: "text",
					role: "combobox",
					mono,
					disabled,
					readOnly,
					autoComplete: "off",
					spellCheck: false,
					"aria-autocomplete": "list",
					"aria-expanded": open,
					"aria-controls": open ? listId : void 0,
					"aria-activedescendant": current >= 0 ? optionId(current) : void 0,
					value,
					onChange: (event) => change(event.target.value),
					onFocus: (event) => {
						setFocused(true);
						onFocus?.(event);
					},
					onBlur: (event) => {
						setFocused(false);
						setDismissed(false);
						setActive(-1);
						onBlur?.(event);
					},
					onKeyDown: (event) => {
						onKeyDown?.(event);
						if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229) return;
						const arrow = event.key === "ArrowDown" || event.key === "ArrowUp";
						if (!open && arrow && dismissed && suggestions.length > 0) {
							event.preventDefault();
							setDismissed(false);
							return;
						}
						if (!open) return;
						const count = suggestions.length;
						if (event.key === "ArrowDown") {
							event.preventDefault();
							setActive((current + 1) % count);
						} else if (event.key === "ArrowUp") {
							event.preventDefault();
							setActive(current <= 0 ? count - 1 : current - 1);
						} else if (event.key === "Enter" && current >= 0) {
							event.preventDefault();
							choose(suggestions[current]);
						}
					}
				})
			})
		}), /* @__PURE__ */ jsx(PopoverContent, {
			align: "start",
			surface: "menu",
			className: picker_module_default.pathList,
			onOpenAutoFocus: (event) => event.preventDefault(),
			onCloseAutoFocus: (event) => event.preventDefault(),
			onInteractOutside: (event) => {
				if (anchor.current?.contains(event.target)) event.preventDefault();
			},
			children: /* @__PURE__ */ jsxs("div", {
				ref: listInset,
				id: listId,
				role: "listbox",
				"aria-label": "Folders",
				"data-scroll-fade": "y",
				className: cn(menu_module_default.list, menu_module_default.inset),
				children: [suggestions.map((name, index) => /* @__PURE__ */ jsxs("div", {
					id: optionId(index),
					role: "option",
					tabIndex: -1,
					"aria-selected": index === current,
					"data-active": index === current || void 0,
					className: cn(menu_module_default.row, picker_module_default.option),
					onPointerMove: () => setActive(index),
					onMouseDown: (event) => event.preventDefault(),
					onClick: () => choose(name),
					children: [/* @__PURE__ */ jsx(Icon, { name: "folder" }), /* @__PURE__ */ jsx("span", {
						className: picker_module_default.optionLabel,
						children: name
					})]
				}, name)), /* @__PURE__ */ jsx(ListHighlight, {})]
			})
		})]
	});
}
SecretPathInput.displayName = "SecretPathInput";
function GlobPatternHelp({ label = "Glob patterns" }) {
	return /* @__PURE__ */ jsx(FieldHelp, {
		label,
		children: /* @__PURE__ */ jsxs("span", {
			className: helpers_module_default.globHelp,
			children: [
				/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("code", { children: "*" }), " matches any characters inside one folder."] }),
				/* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("code", { children: "**" }), " matches any number of nested folders."] }),
				/* @__PURE__ */ jsxs("span", { children: [
					/* @__PURE__ */ jsx("code", { children: "/app/*" }),
					" matches the folders directly inside ",
					/* @__PURE__ */ jsx("code", { children: "/app" }),
					"."
				] }),
				/* @__PURE__ */ jsxs("span", { children: [
					/* @__PURE__ */ jsx("code", { children: "/app/**" }),
					" matches ",
					/* @__PURE__ */ jsx("code", { children: "/app" }),
					" and everything under it."
				] })
			]
		})
	});
}
GlobPatternHelp.displayName = "GlobPatternHelp";
export { GlobPatternHelp, SecretPathInput };

//# sourceMappingURL=secret-path-input.js.map