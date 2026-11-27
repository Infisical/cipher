"use client";
import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Code } from "./code.js";
import { Icon } from "./icon.js";
import { Json } from "./json.js";
import { MiddleTruncate } from "./middle-truncate.js";
import "./secret-input.js";
import { CopyButton } from "./sensitive-editor.js";
import { prepareJson } from "./json-model.js";
import { Tooltip } from "./tooltip.js";
import button_geometry_module_default from "./button-geometry.module.js";
import code_module_default from "./code.module.js";
import frame_module_default from "./frame.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/code-block.tsx
var textOf = (node) => {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textOf).join("");
	if (!React.isValidElement(node)) return "";
	const { children, ...rest } = node.props;
	return [...Object.entries(rest).flatMap(([key, value]) => typeof value === "string" || typeof value === "number" ? [`${key}=${value}`] : []), textOf(children)].join("\0");
};
var CodeBlock = ({ children, code, label, icon, actions, copyable = true, copyValue, copyLabel = "Copy code", onCopy, writeClipboard, sensitive = false, className, ...props }) => {
	const json = React.isValidElement(children) && children.type === Json ? children : null;
	const shown = json ? prepareJson(json.props.value, json.props.redact).text : code ?? (typeof children === "string" ? children : "");
	const source = json ? shown : copyValue ?? shown;
	const hasCopySource = Boolean(json) || copyValue !== void 0 || code !== void 0 || typeof children === "string";
	const embedded = useInFrame("CodeBlock");
	const labelText = typeof label === "string" ? label : void 0;
	const identityId = React.useId();
	const revealKey = `${shown || textOf(children)}\u0000${source}`;
	const [revealed, setRevealed] = React.useState(null);
	if (revealed !== null && (!sensitive || revealed !== revealKey)) setRevealed(null);
	const masked = sensitive && revealed !== revealKey;
	return /* @__PURE__ */ jsx("section", {
		"data-slot": "code-block",
		"aria-label": labelText,
		"aria-labelledby": label && !labelText ? identityId : void 0,
		"data-embedded": embedded || void 0,
		className: cn(!embedded && frame_module_default.frame, code_module_default.codeBlock, className),
		children: /* @__PURE__ */ jsxs(FrameScope, {
			framed: true,
			children: [(label || actions || copyable || sensitive) && /* @__PURE__ */ jsxs("div", {
				className: code_module_default.header,
				"data-has-actions": Boolean(actions) || void 0,
				children: [/* @__PURE__ */ jsxs("div", {
					id: identityId,
					className: code_module_default.identity,
					children: [icon && /* @__PURE__ */ jsx(Icon, { icon }), labelText ? /* @__PURE__ */ jsx(MiddleTruncate, {
						keepEnd: 16,
						className: code_module_default.blockLabel,
						children: labelText
					}) : label]
				}), (actions || copyable || sensitive) && /* @__PURE__ */ jsxs("div", {
					className: code_module_default.actions,
					children: [
						actions,
						sensitive && /* @__PURE__ */ jsx(Tooltip, {
							content: masked ? "Reveal value" : "Hide value",
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								className: button_geometry_module_default.nestedAction,
								iconOnly: true,
								icon: masked ? "eye" : "eye-off",
								"aria-pressed": !masked,
								onClick: () => setRevealed(masked ? revealKey : null),
								children: "Reveal value"
							})
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
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: cn(frame_module_default.frameInset, code_module_default.body),
				children: masked ? /* @__PURE__ */ jsx(Code, {
					block: true,
					...props,
					format: "plain",
					code: (shown || "••••••••••••••••").replace(/./gu, "•"),
					label: `${labelText ?? "Code"}, hidden`,
					"aria-hidden": true,
					"data-masked": ""
				}) : json ?? (typeof children === "string" || children === void 0 ? /* @__PURE__ */ jsx(Code, {
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