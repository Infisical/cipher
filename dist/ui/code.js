import { cn } from "../lib/utils.js";
import { normalizeCodeLanguage, tokenizeCode } from "./code-tokenizer.js";
import code_module_default from "./code.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/code.tsx
function Code({ children, code, block = false, language = "text", format = "syntax", lineNumbers = false, highlight = [], wrap = false, maxLines, maxHeight, label, className, style, ref, ...props }) {
	if (!block) return /* @__PURE__ */ jsx("code", {
		ref,
		"data-slot": "code",
		className: cn(code_module_default.code, code_module_default.inline, className),
		style,
		...props,
		children: code ?? children
	});
	const value = code ?? (typeof children === "string" ? children : "");
	return /* @__PURE__ */ jsx("pre", {
		"data-slot": "code-block-content",
		tabIndex: 0,
		role: "region",
		"aria-label": label ?? `${language} code`,
		"data-scroll-fade": "both",
		className: cn(code_module_default.code, code_module_default.block, wrap && code_module_default.wrap, className),
		style: {
			maxHeight: maxHeight ?? (maxLines ? `calc(${maxLines} * 1lh + 2 * var(--v4-space-surface-inset))` : void 0),
			...style
		},
		children: /* @__PURE__ */ jsx("code", {
			ref,
			"data-language": normalizeCodeLanguage(language),
			...props,
			children: value.split("\n").map((line, index, lines) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("span", {
				className: cn(code_module_default.line, highlight.includes(index + 1) && code_module_default.highlight),
				children: [lineNumbers && /* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					className: code_module_default.number,
					children: index + 1
				}), tokenizeCode(line, format === "plain" ? "plain" : language).map((token, tokenIndex) => /* @__PURE__ */ jsx("span", {
					className: code_module_default[`token_${token.kind}`],
					children: token.text
				}, tokenIndex))]
			}), index < lines.length - 1 ? "\n" : null] }, index))
		})
	});
}
Code.displayName = "Code";
export { Code };

//# sourceMappingURL=code.js.map