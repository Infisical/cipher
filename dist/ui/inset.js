"use client";
import { cn } from "../lib/utils.js";
import inset_module_default from "./inset.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/inset.tsx
/**
* A block inside a framed container (a card, sheet section or frame): tinted fill, inset padding and no border.
* Use it for every block nested in a frame, such as a resource, a template, a summary tile or a drop target,
* instead of a bordered Card or frame, so two frames never nest.
*/
function Inset({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "inset",
		className: cn(inset_module_default.inset, className),
		...props
	});
}
Inset.displayName = "Inset";
export { Inset };

//# sourceMappingURL=inset.js.map