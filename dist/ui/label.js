"use client";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { Label as Label$1 } from "radix-ui";
// src/ui/label.tsx
function Label({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Label$1.Root, {
		ref,
		"data-slot": "label",
		className: cn(controls_module_default.label, "flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
Label.displayName = "Label";
export { Label };

//# sourceMappingURL=label.js.map