"use client";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Separator as Separator$1 } from "radix-ui";
// src/ui/separator.tsx
function Separator({ className, orientation = "horizontal", decorative = false, label, align = "center", soft = false, ref, ...props }) {
	if (label) return /* @__PURE__ */ jsxs("div", {
		"data-slot": "separator-label",
		"data-align": align,
		className: controls_module_default.separatorLabel,
		children: [
			/* @__PURE__ */ jsx(Separator, {
				ref,
				decorative,
				className: align === "start" ? controls_module_default.separatorLead : void 0,
				soft,
				...props
			}),
			/* @__PURE__ */ jsx("span", { children: label }),
			/* @__PURE__ */ jsx(Separator, {
				decorative: true,
				soft
			})
		]
	});
	return /* @__PURE__ */ jsx(Separator$1.Root, {
		ref,
		"data-slot": "separator",
		decorative,
		orientation,
		className: cn("shrink-0 bg-[color:var(--v4-line)] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch", soft && controls_module_default.separatorSoft, className),
		...props
	});
}
Separator.displayName = "Separator";
export { Separator };

//# sourceMappingURL=separator.js.map