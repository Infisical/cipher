import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useFieldControlAttributes } from "../lib/field-context.js";
import { cn } from "../lib/utils.js";
import { CopyButton } from "./sensitive-editor.js";
import code_module_default from "./code.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/snippet.tsx
var snippetFlags = { "data-input-focus": `:scope > .${code_module_default.input}:focus-visible` };
var snippetWatch = {
	subtree: false,
	focus: true
};
function Snippet({ id, "aria-describedby": describedBy, "aria-invalid": invalid, value, prompt, size = "sm", copyable = true, copyLabel = "Copy command", label, onCopy, writeClipboard, maxLines, className, ref }) {
	const attributes = useFieldControlAttributes({
		id,
		"aria-describedby": describedBy,
		"aria-invalid": invalid
	});
	const snippetRef = useDescendantFlags(snippetFlags, snippetWatch);
	const multiline = maxLines !== void 0;
	const lines = Math.max(1, maxLines ?? 1);
	const rows = Math.min(lines, value.split("\n").length);
	const field = multiline ? /* @__PURE__ */ jsx("textarea", {
		ref,
		...attributes,
		className: cn(code_module_default.input, code_module_default.snippetLines),
		"data-scroll-fade": "y",
		style: {
			"--v4-snippet-lines": lines,
			"--v4-snippet-rows": rows
		},
		"aria-label": label,
		value,
		rows,
		readOnly: true,
		spellCheck: false
	}) : /* @__PURE__ */ jsx("input", {
		ref,
		...attributes,
		className: code_module_default.input,
		"aria-label": label,
		value,
		readOnly: true,
		spellCheck: false
	});
	return /* @__PURE__ */ jsxs("div", {
		ref: snippetRef,
		"data-slot": "snippet",
		"data-size": size,
		"data-multiline": multiline || void 0,
		className: cn(code_module_default.snippet, size === "sm" && code_module_default.snippetSmall, className),
		children: [
			prompt && /* @__PURE__ */ jsx("span", {
				"aria-hidden": "true",
				className: code_module_default.prompt,
				children: prompt
			}),
			field,
			copyable && /* @__PURE__ */ jsx(CopyButton, {
				value,
				size,
				label: copyLabel,
				iconOnly: true,
				onCopy,
				writeClipboard
			})
		]
	});
}
Snippet.displayName = "Snippet";
export { Snippet };

//# sourceMappingURL=snippet.js.map