"use client";
import { useSlashShortcut } from "../lib/slash-shortcut.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Input } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";
import { Spinner } from "./spinner.js";
import { Tooltip } from "./tooltip.js";
import header_search_module_default from "./header-search.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/header-search.tsx
/**
* An icon trigger for a Card's action slot that opens a popover search. It takes the control height of
* the slot it sits in (the 28px band tier in a framed card's head), so leave its size unset.
*/
function HeaderSearch({ value, onValueChange, label, placeholder = "Search", debounceMs = 0, pending = false, hint, shortcut = "card", className }) {
	const [open, setOpen] = React.useState(false);
	const [draft, setDraft] = React.useState(value);
	const [synced, setSynced] = React.useState(value);
	if (value !== synced) {
		setSynced(value);
		setDraft(value);
	}
	const timer = React.useRef(void 0);
	const trigger = React.useRef(null);
	const field = React.useRef(null);
	React.useEffect(() => () => clearTimeout(timer.current), []);
	useSlashShortcut(trigger, {
		enabled: Boolean(shortcut),
		scope: shortcut === "page" ? "page" : "card",
		onTrigger: () => setOpen(true)
	});
	const apply = (next) => {
		clearTimeout(timer.current);
		if (next !== value) onValueChange(next);
	};
	const type = (next) => {
		setDraft(next);
		if (!debounceMs) {
			apply(next);
			return;
		}
		clearTimeout(timer.current);
		timer.current = setTimeout(() => onValueChange(next), debounceMs);
	};
	const applied = value !== "";
	const busy = pending || draft !== value;
	return /* @__PURE__ */ jsxs(Popover, {
		open,
		onOpenChange: (next) => {
			if (!next) apply(draft);
			setOpen(next);
		},
		children: [/* @__PURE__ */ jsxs("span", {
			"data-slot": "header-search",
			"data-applied": applied || void 0,
			className: cn(header_search_module_default.root, className),
			children: [/* @__PURE__ */ jsx(Tooltip, {
				content: label,
				shortcut: shortcut ? "/" : void 0,
				children: /* @__PURE__ */ jsx(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsx(Button, {
						ref: trigger,
						variant: "bare",
						icon: "search",
						iconOnly: true,
						"aria-label": applied ? `${label}: ${value}` : label,
						className: header_search_module_default.trigger,
						children: label
					})
				})
			}), applied && /* @__PURE__ */ jsx("span", {
				"aria-hidden": true,
				className: header_search_module_default.dot
			})]
		}), /* @__PURE__ */ jsxs(PopoverContent, {
			align: "end",
			"aria-label": label,
			className: header_search_module_default.panel,
			onOpenAutoFocus: (event) => {
				event.preventDefault();
				field.current?.focus();
				field.current?.select();
			},
			children: [/* @__PURE__ */ jsx(Input, {
				ref: field,
				type: "search",
				size: "md",
				icon: "search",
				value: draft,
				placeholder,
				"aria-label": label,
				"aria-busy": busy || void 0,
				enterKeyHint: "search",
				className: header_search_module_default.field,
				onChange: (event) => type(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter") apply(draft);
				},
				trailing: (busy || draft) && /* @__PURE__ */ jsxs(Fragment, { children: [busy && /* @__PURE__ */ jsx(Spinner, {}), draft && /* @__PURE__ */ jsx(Button, {
					variant: "bare",
					size: "icon-xs",
					icon: "x",
					iconOnly: true,
					onClick: () => {
						setDraft("");
						apply("");
						field.current?.focus();
					},
					children: "Clear search"
				})] })
			}), /* @__PURE__ */ jsx("div", {
				role: "status",
				className: header_search_module_default.hint,
				"data-empty": hint ? void 0 : "",
				children: hint
			})]
		})]
	});
}
HeaderSearch.displayName = "HeaderSearch";
export { HeaderSearch };

//# sourceMappingURL=header-search.js.map