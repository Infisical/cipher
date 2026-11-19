import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Spinner } from "./spinner.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/toast-stack.tsx
var Toast = ({ item, onDismiss }) => {
	const duration = item.tone === "bad" || item.tone === "loading" ? 0 : item.duration ?? 5e3;
	const [hovered, setHovered] = React.useState(false);
	const [focused, setFocused] = React.useState(false);
	const remaining = React.useRef(duration);
	React.useEffect(() => {
		remaining.current = duration;
	}, [duration, item.id]);
	React.useEffect(() => {
		if (!duration || !onDismiss || hovered || focused) return;
		const started = Date.now();
		const timer = window.setTimeout(() => onDismiss(item.id), remaining.current);
		return () => {
			window.clearTimeout(timer);
			remaining.current = Math.max(0, remaining.current - (Date.now() - started));
		};
	}, [
		duration,
		item.id,
		onDismiss,
		hovered,
		focused
	]);
	return /* @__PURE__ */ jsxs("div", {
		onPointerEnter: () => setHovered(true),
		onPointerLeave: () => setHovered(false),
		onFocus: () => setFocused(true),
		onBlur: (event) => {
			if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setFocused(false);
		},
		"data-slot": "toast",
		"data-tone": item.tone ?? "neutral",
		className: helpers_module_default.toast,
		children: [
			item.tone === "loading" ? /* @__PURE__ */ jsx(Spinner, {}) : /* @__PURE__ */ jsx(Icon, { icon: item.icon ?? (item.tone === "bad" ? "alert-c" : item.tone === "ok" ? "check-c" : "info") }),
			/* @__PURE__ */ jsxs("div", {
				className: helpers_module_default.toastBody,
				children: [
					/* @__PURE__ */ jsx("div", {
						className: helpers_module_default.toastTitle,
						children: item.title
					}),
					item.description && /* @__PURE__ */ jsx("div", {
						className: helpers_module_default.toastDescription,
						children: item.description
					}),
					item.action && /* @__PURE__ */ jsx("div", {
						className: helpers_module_default.toastActions,
						children: /* @__PURE__ */ jsx(Button, {
							type: "button",
							size: "sm",
							variant: "ghost",
							onClick: item.action.onClick,
							children: item.action.label
						})
					})
				]
			}),
			onDismiss && item.tone !== "loading" && /* @__PURE__ */ jsx(Button, {
				type: "button",
				size: "icon-sm",
				variant: "ghost",
				"aria-label": `Dismiss ${item.title}`,
				onClick: () => onDismiss(item.id),
				children: /* @__PURE__ */ jsx(Icon, { name: "x" })
			})
		]
	});
};
var announcementKey = (item) => `${item.id}:${item.tone ?? "neutral"}:${item.title}`;
var announce = (fresh) => fresh.length ? {
	key: fresh.map(announcementKey).join("|"),
	text: fresh.map((item) => [item.title, item.description].filter(Boolean).join(" ")).join(" ")
} : null;
var ToastStack = ({ items, onDismiss, inline = false, className }) => {
	const [previous, setPrevious] = React.useState(items);
	const [polite, setPolite] = React.useState(null);
	const [assertive, setAssertive] = React.useState(null);
	if (previous !== items) {
		setPrevious(items);
		const known = new Set(previous.map(announcementKey));
		const fresh = items.filter((item) => !known.has(announcementKey(item)));
		const errors = announce(fresh.filter((item) => item.tone === "bad"));
		const others = announce(fresh.filter((item) => item.tone !== "bad"));
		if (errors) setAssertive(errors);
		if (others) setPolite(others);
	}
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "toast-stack",
		className: cn(helpers_module_default.toastStack, !inline && helpers_module_default.toastFixed, className),
		children: [
			/* @__PURE__ */ jsx("div", {
				role: "status",
				className: "sr-only",
				"data-slot": "toast-live-polite",
				children: polite && /* @__PURE__ */ jsx("p", { children: polite.text }, polite.key)
			}),
			/* @__PURE__ */ jsx("div", {
				role: "alert",
				className: "sr-only",
				"data-slot": "toast-live-assertive",
				children: assertive && /* @__PURE__ */ jsx("p", { children: assertive.text }, assertive.key)
			}),
			items.map((item) => /* @__PURE__ */ jsx(Toast, {
				item,
				onDismiss
			}, item.id))
		]
	});
};
export { ToastStack };

//# sourceMappingURL=toast-stack.js.map