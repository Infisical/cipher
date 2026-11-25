"use client";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { useFittingPlaceholder } from "../lib/fitting-placeholder.js";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/ui/textarea.tsx
function Textarea({ className, mono = false, rows, maxRows, style, placeholder, placeholderShort, ref, ...props }) {
	const fieldAttributes = useFieldControlAttributes(props);
	const inner = React.useRef(null);
	React.useImperativeHandle(ref, () => inner.current);
	const shownPlaceholder = useFittingPlaceholder(inner, placeholder, placeholderShort, { truncate: true });
	return /* @__PURE__ */ jsx("textarea", {
		ref: inner,
		"data-slot": "textarea",
		placeholder: shownPlaceholder,
		"data-size": "sm",
		"data-mono": mono || void 0,
		"data-rows": rows === void 0 ? void 0 : "",
		"data-max-rows": maxRows === void 0 ? void 0 : "",
		rows,
		style: rows === void 0 && maxRows === void 0 ? style : {
			...style,
			...rows === void 0 ? {} : { "--cipher-textarea-rows": rows },
			...maxRows === void 0 ? {} : { "--cipher-textarea-max-rows": maxRows }
		},
		className: cn(controls_module_default.field, controls_module_default.textarea, "flex w-full", className),
		...props,
		...fieldAttributes
	});
}
Textarea.displayName = "Textarea";
export { Textarea };

//# sourceMappingURL=textarea.js.map