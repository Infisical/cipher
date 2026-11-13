import { cn } from "../lib/utils.js";
import { AnimatedCollapse } from "./animated-collapse.js";
import { Code } from "./code.js";
import { prepareJson, redactJson } from "./json-model.js";
import code_module_default from "./code.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/json.tsx
function preview(node, depth, maxDepth, budget, name) {
	const result = {
		node,
		name
	};
	budget.remaining -= 1;
	if (budget.remaining < 0 || depth > maxDepth) return {
		...result,
		limited: true
	};
	if (node.kind === "scalar") return result;
	const entries = node.kind === "array" ? node.items.map((child) => ({
		node: child,
		key: void 0
	})) : node.entries;
	result.children = [];
	entries.forEach((entry) => {
		if (budget.remaining <= 0) result.limited = true;
		else result.children?.push(preview(entry.node, depth + 1, maxDepth, budget, entry.key));
	});
	return result;
}
var TreeNode = ({ item, depth, expanded }) => {
	const [open, setOpen] = React.useState(depth < expanded);
	const id = React.useId();
	const prefix = item.name === void 0 ? null : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		className: code_module_default.key,
		children: JSON.stringify(item.name)
	}), /* @__PURE__ */ jsx("span", {
		className: code_module_default.punctuation,
		children: ": "
	})] });
	if (item.node.kind === "scalar") return /* @__PURE__ */ jsxs("div", {
		className: code_module_default.entry,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: code_module_default.treeCaret,
				"aria-hidden": "true"
			}),
			prefix,
			/* @__PURE__ */ jsx("span", {
				className: item.node.raw.startsWith("\"") ? code_module_default.string : code_module_default.primitive,
				children: item.node.raw
			})
		]
	});
	const array = item.node.kind === "array";
	const count = item.node.kind === "array" ? item.node.items.length : item.node.entries.length;
	return /* @__PURE__ */ jsxs("div", {
		className: code_module_default.treeNode,
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: code_module_default.treeToggle,
			"aria-expanded": open,
			"aria-controls": id,
			onClick: () => setOpen(!open),
			children: [/* @__PURE__ */ jsx("span", {
				className: cn(code_module_default.treeCaret, code_module_default.punctuation),
				"aria-hidden": "true",
				children: open ? "▾" : "▸"
			}), /* @__PURE__ */ jsxs("span", { children: [prefix, /* @__PURE__ */ jsxs("span", {
				className: code_module_default.punctuation,
				children: [
					array ? "[" : "{",
					" … ",
					array ? "]" : "}",
					" ",
					count,
					" ",
					array ? "items" : "keys"
				]
			})] })]
		}), /* @__PURE__ */ jsx(AnimatedCollapse, {
			id,
			open,
			lazy: true,
			children: /* @__PURE__ */ jsxs("div", {
				className: code_module_default.treeChildren,
				children: [item.children?.map((child, index) => /* @__PURE__ */ jsx(TreeNode, {
					item: child,
					depth: depth + 1,
					expanded
				}, `${index}-${child.name ?? ""}`)), item.limited && /* @__PURE__ */ jsx("p", {
					className: code_module_default.notice,
					children: "Preview limit reached. Copy retains the complete safe payload."
				})]
			})
		})]
	});
};
var Json = ({ value, redact, defaultExpandDepth = 2, wrap = false, maxLines, maxHeight, label = "JSON data", className, maxDepth = 12, maxNodes = 500 }) => {
	const safe = prepareJson(value, redact);
	const tree = safe.document ? preview(safe.document, 0, Number.isFinite(maxDepth) ? Math.max(0, Math.min(maxDepth, 32)) : 12, { remaining: Number.isFinite(maxNodes) ? Math.max(1, Math.min(maxNodes, 2e3)) : 500 }) : null;
	if (!tree) return /* @__PURE__ */ jsxs("div", { children: [
		safe.notice && /* @__PURE__ */ jsx("p", {
			role: "status",
			className: code_module_default.notice,
			children: safe.notice
		}),
		/* @__PURE__ */ jsx(Code, {
			block: true,
			code: safe.text.slice(0, 2e4),
			wrap,
			maxLines,
			maxHeight,
			label,
			className
		}),
		safe.text.length > 2e4 && /* @__PURE__ */ jsx("p", {
			className: code_module_default.notice,
			children: "Preview shortened. Copy retains the complete safe payload."
		})
	] });
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "json",
		role: "region",
		"aria-label": label,
		tabIndex: 0,
		"data-scroll-fade": "both",
		className: cn(code_module_default.tree, wrap && code_module_default.wrap, className),
		style: { maxHeight: maxHeight ?? (maxLines ? `calc(${maxLines} * 1lh + 2 * var(--v4-space-surface-inset))` : void 0) },
		children: /* @__PURE__ */ jsx(TreeNode, {
			item: tree,
			depth: 0,
			expanded: defaultExpandDepth
		}, safe.text)
	});
};
export { Json, prepareJson, redactJson };

//# sourceMappingURL=json.js.map