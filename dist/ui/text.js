import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Spinner } from "./spinner.js";
import text_module_default from "./text.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/text.tsx
function Text({ muted = false, preWrap = false, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "text",
		className: cn(text_module_default.text, muted && text_module_default.muted, preWrap && text_module_default.preWrap, className),
		...props
	});
}
Text.displayName = "Text";
function SmallText({ muted = false, preWrap = false, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "small-text",
		className: cn(text_module_default.small, muted && text_module_default.muted, preWrap && text_module_default.preWrap, className),
		...props
	});
}
SmallText.displayName = "SmallText";
function Heading({ level = 2, size = "section", className, ref, ...props }) {
	const Tag = `h${level}`;
	return /* @__PURE__ */ jsx(Tag, {
		ref,
		"data-slot": "heading",
		"data-size": size,
		className: cn(text_module_default.heading, className),
		...props
	});
}
Heading.displayName = "Heading";
function Meta({ mono = true, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "meta",
		className: cn(text_module_default.meta, mono && text_module_default.mono, className),
		...props
	});
}
Meta.displayName = "Meta";
function StatusText({ tone = "neutral", size, icon, loading = false, className, children, ref, ...props }) {
	return /* @__PURE__ */ jsxs("span", {
		ref,
		"data-slot": "status-text",
		"data-tone": tone,
		"data-size": size,
		"data-loading": loading || void 0,
		className: cn(text_module_default.status, className),
		...props,
		children: [loading || !icon ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(Icon, { icon }), /* @__PURE__ */ jsx("span", { children })]
	});
}
StatusText.displayName = "StatusText";
/**
* Marks every case-insensitive occurrence of query in text as a search match. The query is literal
* text, never a pattern; terms matches each whitespace-separated word on its own.
*/
function Highlight({ text, query, terms = false, className }) {
	const needles = (terms ? (query ?? "").split(/\s+/) : [(query ?? "").trim() && (query ?? "")]).map((needle) => needle.toLowerCase()).filter(Boolean);
	const lower = text.toLowerCase();
	const ranges = needles.flatMap((needle) => {
		const found = [];
		for (let at = lower.indexOf(needle); at >= 0; at = lower.indexOf(needle, at + 1)) found.push([at, at + needle.length]);
		return found;
	}).sort((a, b) => a[0] - b[0]).reduce((merged, range) => {
		const last = merged.at(-1);
		if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
		else merged.push([...range]);
		return merged;
	}, []);
	if (!ranges.length || lower.length !== text.length) return text;
	const parts = [];
	let from = 0;
	ranges.forEach(([start, end]) => {
		if (start > from) parts.push(text.slice(from, start));
		parts.push(/* @__PURE__ */ jsx("mark", {
			"data-slot": "highlight",
			className: cn(text_module_default.highlight, className),
			children: text.slice(start, end)
		}, start));
		from = end;
	});
	if (from < text.length) parts.push(text.slice(from));
	return parts;
}
export { Heading, Highlight, Meta, SmallText, StatusText, Text };

//# sourceMappingURL=text.js.map