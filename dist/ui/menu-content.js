import { Kbd } from "./kbd.js";
import menu_module_default from "./menu.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/menu-content.tsx
var withDescription = (label, description) => /* @__PURE__ */ jsxs("span", {
	className: menu_module_default.text,
	children: [/* @__PURE__ */ jsx("span", {
		className: menu_module_default.title,
		children: label
	}), /* @__PURE__ */ jsx("span", {
		className: menu_module_default.description,
		children: description
	})]
});
var menuRowContent = (children, description) => {
	if (description === void 0 && React.isValidElement(children)) return children;
	const items = React.Children.toArray(children);
	const textual = (child) => typeof child === "string" || typeof child === "number";
	const labelIndex = description === void 0 || items.some(textual) ? -1 : items.length - 1;
	return items.map((child, index) => {
		if (index !== labelIndex && !textual(child)) return child;
		const content = index !== labelIndex && description === void 0 ? /* @__PURE__ */ jsx("span", {
			className: menu_module_default.title,
			children: child
		}) : withDescription(child, description);
		return /* @__PURE__ */ jsx(React.Fragment, { children: content }, index);
	});
};
var menuShortcutContent = (children) => typeof children === "string" ? /* @__PURE__ */ jsx(Kbd, {
	size: "sm",
	children
}) : children;
export { menuRowContent, menuShortcutContent };

//# sourceMappingURL=menu-content.js.map