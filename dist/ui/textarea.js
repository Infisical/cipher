import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/textarea.tsx
function Textarea({ className, mono = false, rows, style, ref, ...props }) {
	const fieldAttributes = useFieldControlAttributes(props);
	return /* @__PURE__ */ jsx("textarea", {
		ref,
		"data-slot": "textarea",
		"data-size": "sm",
		"data-mono": mono || void 0,
		"data-rows": rows === void 0 ? void 0 : "",
		rows,
		style: rows === void 0 ? style : {
			...style,
			"--v4-textarea-rows": rows
		},
		className: cn(controls_module_default.field, controls_module_default.textarea, "flex w-full", className),
		...props,
		...fieldAttributes
	});
}
Textarea.displayName = "Textarea";
export { Textarea };

//# sourceMappingURL=textarea.js.map