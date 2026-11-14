import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { Code } from "./code.js";
import { Icon } from "./icon.js";
import { Json } from "./json.js";
import { MiddleTruncate } from "./middle-truncate.js";
import { prepareJson } from "./json-model.js";
import { CopyButton } from "./sensitive-editor.js";
import code_module_default from "./code.module.js";
import frame_module_default from "./frame.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/code-block.tsx
var CodeBlock = ({ children, code, label, icon, actions, copyable = true, copyValue, copyLabel = "Copy code", onCopy, writeClipboard, className, ...props }) => {
	const json = React.isValidElement(children) && children.type === Json ? children : null;
	const source = json ? prepareJson(json.props.value, json.props.redact).text : copyValue ?? code ?? (typeof children === "string" ? children : "");
	const hasCopySource = Boolean(json) || copyValue !== void 0 || code !== void 0 || typeof children === "string";
	const embedded = useInFrame("CodeBlock");
	const labelText = typeof label === "string" ? label : void 0;
	const identityId = React.useId();
	return /* @__PURE__ */ jsx("section", {
		"data-slot": "code-block",
		"aria-label": labelText,
		"aria-labelledby": label && !labelText ? identityId : void 0,
		"data-embedded": embedded || void 0,
		className: cn(!embedded && frame_module_default.frame, code_module_default.codeBlock, className),
		children: /* @__PURE__ */ jsxs(FrameScope, {
			framed: true,
			children: [(label || actions || copyable) && /* @__PURE__ */ jsxs("div", {
				className: code_module_default.header,
				"data-has-actions": Boolean(actions) || void 0,
				children: [
					/* @__PURE__ */ jsxs("div", {
						id: identityId,
						className: code_module_default.identity,
						children: [icon && /* @__PURE__ */ jsx(Icon, { name: icon }), labelText ? /* @__PURE__ */ jsx(MiddleTruncate, {
							keepEnd: 16,
							className: code_module_default.blockLabel,
							children: labelText
						}) : label]
					}),
					actions && /* @__PURE__ */ jsx("div", {
						className: code_module_default.actions,
						children: actions
					}),
					copyable && /* @__PURE__ */ jsx(CopyButton, {
						value: source,
						disabled: !hasCopySource,
						label: copyLabel,
						iconOnly: true,
						onCopy,
						writeClipboard
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: cn(frame_module_default.frameInset, code_module_default.body),
				children: json ?? (typeof children === "string" || children === void 0 ? /* @__PURE__ */ jsx(Code, {
					block: true,
					code: code ?? children,
					label: labelText,
					...props
				}) : /* @__PURE__ */ jsx("div", {
					className: code_module_default.customContent,
					children
				}))
			})]
		})
	});
};
export { CodeBlock };

//# sourceMappingURL=code-block.js.map