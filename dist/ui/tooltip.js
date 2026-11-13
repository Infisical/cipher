import { useV4CollisionBoundary, useV4PortalContainer } from "../scope.js";
import { cn } from "../lib/utils.js";
import { Kbd } from "./kbd.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import * as React from "react";
import { flushSync } from "react-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot, Tooltip as Tooltip$1 } from "radix-ui";
// src/ui/tooltip.tsx
var navigationKeys = /* @__PURE__ */ new Set([
	"Tab",
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End"
]);
var lastNavigationKeyAt = -Infinity;
if (typeof document !== "undefined") {
	document.addEventListener("keydown", (event) => {
		lastNavigationKeyAt = navigationKeys.has(event.key) ? performance.now() : -Infinity;
	}, true);
	document.addEventListener("pointerdown", () => {
		lastNavigationKeyAt = -Infinity;
	}, true);
}
var focusedByKeyboard = () => performance.now() - lastNavigationKeyAt < 1e3;
var coveredByOverlay = (trigger) => trigger.getAttribute("aria-expanded") === "true" || getComputedStyle(document.body).pointerEvents === "none";
function TooltipProvider({ delayDuration = 200, disableHoverableContent = true, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip$1.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		disableHoverableContent,
		...props
	});
}
var sharedAttribute = "data-v4-tooltip";
var TooltipScopeContext = React.createContext(null);
function SharedAnchor({ handle, ref, ...handlers }) {
	React.useLayoutEffect(() => {
		handle.current = {
			ref,
			handlers
		};
	});
	return null;
}
function SharedTooltipHost({ store }) {
	const [mounted, setMounted] = React.useState(false);
	const [activeId, setActiveId] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const [, refresh] = React.useReducer((count) => count + 1, 0);
	const contentId = React.useId();
	const handle = React.useRef(null);
	const pending = React.useRef([]);
	const element = React.useRef(null);
	React.useLayoutEffect(() => {
		if (!handle.current || !pending.current.length) return;
		queueMicrotask(() => {
			const anchor = handle.current;
			const queued = pending.current;
			pending.current = [];
			if (anchor) queued.forEach((run) => run(anchor));
		});
	});
	React.useEffect(() => {
		const pressed = /* @__PURE__ */ new WeakSet();
		let hovered = null;
		const run = (step) => {
			if (handle.current) step(handle.current);
			else {
				pending.current.push(step);
				setMounted(true);
			}
		};
		const call = (name, event) => run((anchor) => anchor.handlers[name]?.(event));
		const attach = (target) => {
			if (element.current === target) return;
			element.current = target;
			setActiveId(target.getAttribute(sharedAttribute));
			run((anchor) => {
				const { ref } = anchor;
				if (typeof ref === "function") ref(target);
				else if (ref) ref.current = target;
			});
		};
		const find = (target) => {
			const trigger = target instanceof Element ? target.closest(`[${sharedAttribute}]`) : null;
			const id = trigger?.getAttribute(sharedAttribute);
			return id && store.entries.has(id) ? trigger : null;
		};
		const leave = (event) => {
			const target = hovered;
			hovered = null;
			if (!target) return;
			if (target === element.current) call("onPointerLeave", event);
			if (!coveredByOverlay(target)) pressed.delete(target);
		};
		const onPointerMove = (event) => {
			const trigger = find(event.target);
			if (trigger !== hovered) leave(event);
			if (!trigger) return;
			hovered = trigger;
			if (pressed.has(trigger) || event.pointerType === "touch") return;
			attach(trigger);
			call("onPointerMove", event);
		};
		const onPointerOut = (event) => {
			if (!hovered || !(event.target instanceof Node) || !hovered.contains(event.target)) return;
			if (!(event.relatedTarget instanceof Node && hovered.contains(event.relatedTarget))) leave(event);
		};
		const onPointerDown = (event) => {
			const trigger = find(event.target);
			if (!trigger) return;
			pressed.add(trigger);
			if (trigger === element.current) call("onPointerDown", event);
		};
		const onFocusIn = (event) => {
			const trigger = find(event.target);
			if (!trigger || pressed.has(trigger) || !focusedByKeyboard()) return;
			attach(trigger);
			call("onFocus", event);
		};
		const onFocusOut = (event) => {
			if (element.current && find(event.target) === element.current) call("onBlur", event);
		};
		const onClick = (event) => {
			if (element.current && find(event.target) === element.current) call("onClick", event);
		};
		store.listener = (id) => {
			if (!element.current || element.current.getAttribute(sharedAttribute) !== id) return;
			if (store.entries.has(id)) {
				refresh();
				return;
			}
			call("onPointerLeave", { defaultPrevented: false });
			element.current = null;
			setActiveId(null);
		};
		document.addEventListener("pointermove", onPointerMove, true);
		document.addEventListener("pointerout", onPointerOut, true);
		document.addEventListener("pointerdown", onPointerDown, true);
		document.addEventListener("focusin", onFocusIn, true);
		document.addEventListener("focusout", onFocusOut, true);
		document.addEventListener("click", onClick, true);
		return () => {
			store.listener = null;
			document.removeEventListener("pointermove", onPointerMove, true);
			document.removeEventListener("pointerout", onPointerOut, true);
			document.removeEventListener("pointerdown", onPointerDown, true);
			document.removeEventListener("focusin", onFocusIn, true);
			document.removeEventListener("focusout", onFocusOut, true);
			document.removeEventListener("click", onClick, true);
		};
	}, [store]);
	React.useLayoutEffect(() => {
		const target = element.current;
		if (!open || !target || target.hasAttribute("aria-describedby")) return void 0;
		target.setAttribute("aria-describedby", contentId);
		return () => target.removeAttribute("aria-describedby");
	}, [
		open,
		activeId,
		contentId
	]);
	if (!mounted) return null;
	const entry = activeId ? store.entries.get(activeId) : void 0;
	return /* @__PURE__ */ jsxs(Tooltip$1.Root, {
		"data-slot": "tooltip",
		disableHoverableContent: true,
		open,
		onOpenChange: (next) => flushSync(() => setOpen(next)),
		children: [/* @__PURE__ */ jsx(Tooltip$1.Trigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(SharedAnchor, { handle })
		}), entry && /* @__PURE__ */ jsxs(TooltipContent, {
			id: contentId,
			side: entry.side,
			align: entry.align,
			children: [/* @__PURE__ */ jsx("span", {
				className: menu_module_default.tooltipText,
				children: entry.content
			}), entry.shortcut && /* @__PURE__ */ jsx(Kbd, { children: entry.shortcut })]
		})]
	});
}
/**
* Shares one tooltip among every Tooltip inside it: each trigger renders only its element, marked with
* data-v4-tooltip, and the scope mounts a single Radix tooltip on the first hover or keyboard focus and
* moves it to whichever trigger is active. Table renders one around its rows.
*/
function TooltipScope({ children }) {
	const [store] = React.useState(() => {
		const entries = /* @__PURE__ */ new Map();
		const shared = {
			entries,
			listener: null,
			set: (id, entry) => {
				if (entry) entries.set(id, entry);
				else if (!entries.delete(id)) return;
				shared.listener?.(id);
			}
		};
		return shared;
	});
	return /* @__PURE__ */ jsxs(TooltipScopeContext.Provider, {
		value: store,
		children: [children, /* @__PURE__ */ jsx(SharedTooltipHost, { store })]
	});
}
function SharedTooltip({ store, content, shortcut, side, align, children }) {
	const id = React.useId();
	React.useLayoutEffect(() => {
		store.set(id, content ? {
			content,
			shortcut,
			side,
			align
		} : null);
	}, [
		store,
		id,
		content,
		shortcut,
		side,
		align
	]);
	React.useLayoutEffect(() => () => store.set(id, null), [store, id]);
	return content ? React.cloneElement(children, { [sharedAttribute]: id }) : children;
}
function Tooltip({ content, shortcut, side = "top", align = "center", wrap: _wrap, disableHoverableContent = true, children, ...props }) {
	const store = React.useContext(TooltipScopeContext);
	if (store && disableHoverableContent && props.open === void 0 && props.defaultOpen === void 0 && props.onOpenChange === void 0 && props.delayDuration === void 0 && React.isValidElement(children)) return /* @__PURE__ */ jsx(SharedTooltip, {
		store,
		content,
		shortcut,
		side,
		align,
		children
	});
	return /* @__PURE__ */ jsx(Tooltip$1.Root, {
		"data-slot": "tooltip",
		disableHoverableContent,
		...props,
		children: content ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ jsxs(TooltipContent, {
			side,
			align,
			"data-has-kbd": shortcut ? "" : void 0,
			children: [/* @__PURE__ */ jsx("span", {
				className: menu_module_default.tooltipText,
				children: content
			}), shortcut && /* @__PURE__ */ jsx(Kbd, { children: shortcut })]
		})] }) : children
	});
}
/**
* Opens on hover and on keyboard focus only. Focus that a closing menu, dialog or sheet returns to the
* trigger never opens it, and after a click it stays closed until the pointer leaves and comes back.
*/
function TooltipTrigger({ ref, onPointerDown, onPointerMove, onPointerLeave, onFocus, ...props }) {
	const pressed = React.useRef(false);
	return /* @__PURE__ */ jsx(Tooltip$1.Trigger, {
		ref,
		"data-slot": "tooltip-trigger",
		onPointerDown: (event) => {
			onPointerDown?.(event);
			pressed.current = true;
		},
		onPointerMove: (event) => {
			onPointerMove?.(event);
			if (pressed.current) event.preventDefault();
		},
		onPointerLeave: (event) => {
			onPointerLeave?.(event);
			if (!coveredByOverlay(event.currentTarget)) pressed.current = false;
		},
		onFocus: (event) => {
			onFocus?.(event);
			if (pressed.current || !focusedByKeyboard()) event.preventDefault();
		},
		...props
	});
}
TooltipTrigger.displayName = "TooltipTrigger";
function TooltipContent({ className, collisionPadding = 8, sideOffset = 0, children, ref, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip$1.Portal, {
		container: useV4PortalContainer(),
		children: /* @__PURE__ */ jsxs(Tooltip$1.Content, {
			ref,
			"data-slot": "tooltip-content",
			collisionPadding,
			collisionBoundary: useV4CollisionBoundary(),
			sideOffset,
			className: cn("z-50", menu_module_default.tooltip, menu_module_default.motion, className),
			...props,
			children: [children, /* @__PURE__ */ jsx(Tooltip$1.Arrow, {
				width: 10,
				height: 5,
				className: menu_module_default.tooltipArrow
			})]
		})
	});
}
TooltipContent.displayName = "TooltipContent";
function TooltipText({ content, side, align, asChild = false, className, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	return /* @__PURE__ */ jsx(Tooltip, {
		content,
		side,
		align,
		children: /* @__PURE__ */ jsx(Comp, {
			ref,
			"data-slot": "tooltip-text",
			tabIndex: 0,
			className: cn(controls_module_default.focusOutline, className),
			...props
		})
	});
}
TooltipText.displayName = "TooltipText";
export { Tooltip, TooltipContent, TooltipProvider, TooltipScope, TooltipText, TooltipTrigger };

//# sourceMappingURL=tooltip.js.map