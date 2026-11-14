import { exit, snap, spring } from "../lib/motion.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { Button } from "./button.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog.js";
import announcements_module_default from "./announcements.module.js";
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/announcements.tsx
var Inert = ({ children }) => /* @__PURE__ */ jsx("div", {
	className: announcements_module_default.media,
	"aria-hidden": "true",
	ref: (node) => node?.setAttribute("inert", ""),
	children
});
var Announcements = ({ items, open, defaultOpen = false, onOpenChange, index, defaultIndex = 0, onIndexChange, onSeen, onDone, loop = true, label = "What's new" }) => {
	const [isOpen, setOpen] = useControllableState({
		value: open,
		defaultValue: defaultOpen,
		onChange: onOpenChange
	});
	const [current, setCurrent] = useControllableState({
		value: index,
		defaultValue: defaultIndex,
		onChange: onIndexChange
	});
	const [direction, setDirection] = React.useState(1);
	const reduced = useReducedMotion();
	const next = React.useRef(null);
	const opener = React.useRef(null);
	React.useLayoutEffect(() => {
		if (isOpen && !opener.current) opener.current = document.activeElement;
	}, [isOpen]);
	const item = items[current];
	const last = current === items.length - 1;
	const seen = React.useEffectEvent((id) => onSeen?.(id));
	const itemId = item?.id;
	React.useEffect(() => {
		if (isOpen && itemId) seen(itemId);
	}, [isOpen, itemId]);
	const go = (target) => {
		const wrapped = loop ? (target + items.length) % items.length : target;
		if (wrapped < 0 || wrapped >= items.length || wrapped === current) return;
		setDirection(target > current ? 1 : -1);
		setCurrent(wrapped);
	};
	if (!item) return null;
	const travel = reduced ? 0 : 24;
	return /* @__PURE__ */ jsx(Dialog, {
		open: isOpen,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			"data-slot": "announcements",
			showCloseButton: false,
			"aria-roledescription": "carousel",
			"data-scroll-fade": "y",
			className: announcements_module_default.dialog,
			onOpenAutoFocus: (event) => {
				event.preventDefault();
				next.current?.focus();
			},
			onCloseAutoFocus: (event) => {
				if (!opener.current?.isConnected) return;
				event.preventDefault();
				opener.current.focus();
				opener.current = null;
			},
			onKeyDown: (event) => {
				if (event.key === "ArrowRight") go(current + 1);
				if (event.key === "ArrowLeft") go(current - 1);
			},
			children: [
				/* @__PURE__ */ jsx(DialogTitle, {
					className: "sr-only",
					children: label
				}),
				/* @__PURE__ */ jsx(motion.div, {
					layout: !reduced,
					transition: spring.moderate,
					className: announcements_module_default.viewport,
					children: /* @__PURE__ */ jsx(AnimatePresence, {
						mode: "popLayout",
						initial: false,
						custom: direction,
						children: /* @__PURE__ */ jsxs(motion.div, {
							role: "group",
							"aria-roledescription": "slide",
							"aria-label": `${current + 1} of ${items.length}`,
							custom: direction,
							initial: {
								opacity: 0,
								x: direction * travel
							},
							animate: {
								opacity: 1,
								x: 0,
								transition: reduced ? snap : spring.moderate
							},
							exit: {
								opacity: 0,
								x: -direction * travel,
								transition: reduced ? snap : exit.moderate
							},
							className: announcements_module_default.card,
							children: [item.media && /* @__PURE__ */ jsx(Inert, { children: item.media }), /* @__PURE__ */ jsxs("div", {
								className: announcements_module_default.copy,
								children: [
									/* @__PURE__ */ jsx("p", {
										className: announcements_module_default.eyebrow,
										children: item.eyebrow
									}),
									/* @__PURE__ */ jsx("h3", {
										className: announcements_module_default.title,
										children: item.title
									}),
									/* @__PURE__ */ jsx(DialogDescription, {
										asChild: true,
										children: item.description && /* @__PURE__ */ jsx("div", {
											className: announcements_module_default.description,
											children: item.description
										})
									}),
									item.action && (item.action.href ? /* @__PURE__ */ jsx(Button, {
										variant: "link",
										size: "sm",
										asChild: true,
										className: announcements_module_default.action,
										children: /* @__PURE__ */ jsx("a", {
											href: item.action.href,
											target: item.action.external ? "_blank" : void 0,
											rel: item.action.external ? "noreferrer" : void 0,
											children: item.action.label
										})
									}) : /* @__PURE__ */ jsx(Button, {
										variant: "link",
										size: "sm",
										className: announcements_module_default.action,
										onClick: item.action.onClick,
										children: item.action.label
									}))
								]
							})]
						}, item.id)
					})
				}),
				/* @__PURE__ */ jsx("p", {
					className: "sr-only",
					"aria-live": "polite",
					children: `${current + 1} of ${items.length}: ${item.title}`
				}),
				/* @__PURE__ */ jsxs("div", {
					className: announcements_module_default.footer,
					children: [/* @__PURE__ */ jsx("div", {
						className: announcements_module_default.dots,
						children: items.map((entry, position) => /* @__PURE__ */ jsx("button", {
							type: "button",
							className: announcements_module_default.dot,
							"data-current": position === current || void 0,
							"aria-label": `Show ${position + 1} of ${items.length}`,
							"aria-current": position === current ? "true" : void 0,
							onClick: () => go(position)
						}, entry.id))
					}), /* @__PURE__ */ jsxs("div", {
						className: announcements_module_default.buttons,
						children: [/* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "sm",
							disabled: !loop && current === 0,
							onClick: () => go(current - 1),
							children: "Back"
						}), /* @__PURE__ */ jsx(Button, {
							ref: next,
							variant: "primary",
							size: "sm",
							onClick: () => {
								if (last) {
									setOpen(false);
									onDone?.();
								} else go(current + 1);
							},
							children: last ? "Done" : "Next"
						})]
					})]
				})
			]
		})
	});
};
export { Announcements };

//# sourceMappingURL=announcements.js.map