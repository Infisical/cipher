import { iconShapes } from "./icon-data.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/ui/icon.tsx
var iconNames = Object.keys(iconShapes);
function Icon({ name, icon: Fallback, size, strokeWidth, label, style, ref, ...props }) {
	const dimension = typeof size === "number" ? `${size}px` : size;
	const shared = {
		ref,
		"data-slot": "icon",
		role: label ? "img" : void 0,
		"aria-label": label,
		"aria-hidden": label ? void 0 : true,
		focusable: "false",
		style: {
			width: dimension,
			height: dimension,
			strokeWidth,
			...style
		},
		...props
	};
	if (name) return /* @__PURE__ */ jsx("svg", {
		...shared,
		"data-icon-name": name,
		"data-icon-source": "custom",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: iconShapes[name].map((shape, index) => React.createElement(shape.tag, {
			...shape.attributes,
			key: index
		}))
	});
	if (!Fallback) return null;
	return /* @__PURE__ */ jsx(Fallback, {
		...shared,
		"data-icon-source": "lucide"
	});
}
Icon.displayName = "Icon";
export { Icon, iconNames };

//# sourceMappingURL=icon.js.map