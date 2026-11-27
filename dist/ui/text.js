"use client";
import { cn, truncateTitle } from "../lib/utils.js";
import { TitleCount } from "./badge.js";
import { Icon } from "./icon.js";
import { Spinner } from "./spinner.js";
import { useReason } from "./tooltip.js";
import text_module_default from "./text.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/text.tsx
function Text({ muted = false, preWrap = false, truncate = false, title, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "text",
		title: truncateTitle(truncate, title, props.children),
		className: cn(text_module_default.text, muted && text_module_default.muted, preWrap && text_module_default.preWrap, truncate && text_module_default.endTruncate, className),
		...props
	});
}
Text.displayName = "Text";
function SmallText({ muted = false, preWrap = false, truncate = false, title, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "small-text",
		title: truncateTitle(truncate, title, props.children),
		className: cn(text_module_default.small, muted && text_module_default.muted, preWrap && text_module_default.preWrap, truncate && text_module_default.endTruncate, className),
		...props
	});
}
SmallText.displayName = "SmallText";
function Heading({ level = 2, size = "section", count, className, children, ref, ...props }) {
	const Tag = `h${level}`;
	return /* @__PURE__ */ jsx(Tag, {
		ref,
		"data-slot": "heading",
		"data-size": size,
		className: cn(text_module_default.heading, className),
		...props,
		children: count == null ? children : /* @__PURE__ */ jsx(TitleCount, {
			count,
			wrap: true,
			children
		})
	});
}
Heading.displayName = "Heading";
function Meta({ mono = true, truncate = false, title, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "meta",
		title: truncateTitle(truncate, title, props.children),
		className: cn(text_module_default.meta, mono && text_module_default.mono, truncate && text_module_default.endTruncate, className),
		...props
	});
}
Meta.displayName = "Meta";
var EMPTY_VALUE = "—";
/** The placeholder for a value that isn't set, such as an empty table cell or a token with no expiry. Screen readers hear the label instead of the dash. */
function EmptyValue({ label = "None", className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("span", {
		ref,
		"data-slot": "empty-value",
		className: cn(text_module_default.emptyValue, className),
		...props,
		children: [/* @__PURE__ */ jsx("span", {
			"aria-hidden": true,
			children: "—"
		}), /* @__PURE__ */ jsx("span", {
			className: text_module_default.sr,
			children: label
		})]
	});
}
EmptyValue.displayName = "EmptyValue";
/** A compact uppercase group label, such as WHEN or CONDITIONS above a block of rules. */
function Eyebrow({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "eyebrow",
		className: cn(text_module_default.eyebrow, className),
		...props
	});
}
Eyebrow.displayName = "Eyebrow";
function StatusText({ tone = "neutral", size, icon, loading = false, reason, className, children, ref, ...props }) {
	const reasonTooltip = useReason(reason);
	return reasonTooltip.wrap(/* @__PURE__ */ jsxs("span", {
		ref,
		"data-slot": "status-text",
		"data-tone": tone,
		"data-size": size,
		"data-loading": loading || void 0,
		className: cn(text_module_default.status, "[&>svg]:cipher-lead-line", className),
		...props,
		"aria-describedby": reasonTooltip.describedBy(props["aria-describedby"]),
		children: [
			loading ? /* @__PURE__ */ jsx(Spinner, {}) : icon && /* @__PURE__ */ jsx(Icon, { icon }),
			/* @__PURE__ */ jsx("span", { children }),
			reasonTooltip.description
		]
	}), true);
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
export { EMPTY_VALUE, EmptyValue, Eyebrow, Heading, Highlight, Meta, SmallText, StatusText, Text };

//# sourceMappingURL=text.js.map