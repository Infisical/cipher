"use client";
import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { RowDescriptionContext } from "../lib/row-description.js";
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
var tapAttribute = "data-tooltip-tap";
var tapToggles = /* @__PURE__ */ new WeakMap();
var tapClicks = /* @__PURE__ */ new WeakSet();
var tapped = null;
if (typeof document !== "undefined") {
	document.addEventListener("keydown", (event) => {
		lastNavigationKeyAt = navigationKeys.has(event.key) ? performance.now() : -Infinity;
	}, true);
	document.addEventListener("pointerdown", (event) => {
		lastNavigationKeyAt = -Infinity;
		tapped = event.pointerType === "touch" && event.target instanceof Element ? event.target.closest(`[${tapAttribute}]`) : null;
		if (tapped) tapToggles.get(tapped)?.();
	}, true);
	document.addEventListener("click", (event) => {
		if (tapped && event.target instanceof Node && tapped.contains(event.target)) {
			event.preventDefault();
			tapClicks.add(event);
		}
		tapped = null;
	}, true);
}
/** Handlers the reason wrapper adds itself, so TooltipText doesn't mistake its element for a control of its own. */
var internalHandlers = /* @__PURE__ */ new WeakSet();
var callerHandler = (handler) => typeof handler === "function" && !internalHandlers.has(handler);
var skipTapClick = (onClick) => {
	const handler = (event) => {
		if (!tapClicks.has(event.nativeEvent)) onClick?.(event);
	};
	if (!onClick) internalHandlers.add(handler);
	return handler;
};
/** Radix closes every open tooltip on this event when one opens; a tap opens without Radix, so it sends it itself. */
var closeOtherTooltips = () => document.dispatchEvent(new CustomEvent("tooltip.open"));
var focusedByKeyboard = () => performance.now() - lastNavigationKeyAt < 1e3;
var coveredByOverlay = (trigger) => trigger.getAttribute("aria-expanded") === "true" || getComputedStyle(document.body).pointerEvents === "none";
/**
* Whether an element of a row shows in full: inside every ancestor that clips sideways and the window, and not
* under a cell pinned over the scrolled columns. A sideways-scrolled table can leave a row's trigger out of view.
*/
var visibleInRow = (row) => {
	const pinned = [...row.cells].filter((cell) => cell.hasAttribute("data-pin"));
	return (item) => {
		const box = item.getBoundingClientRect();
		if (box.width === 0) return false;
		let left = 0;
		let right = document.documentElement.clientWidth;
		for (let node = item.parentElement; node; node = node.parentElement) {
			if (!/auto|scroll|hidden|clip/.test(getComputedStyle(node).overflowX)) continue;
			const clip = node.getBoundingClientRect();
			left = Math.max(left, clip.left);
			right = Math.min(right, clip.right);
		}
		if (box.left < left - 1 || box.right > right + 1) return false;
		if (item.closest("td, th")?.hasAttribute("data-pin")) return true;
		return pinned.every((pin) => {
			const cover = pin.getBoundingClientRect();
			return box.right <= cover.left + 1 || box.left >= cover.right - 1;
		});
	};
};
var ProvidedContext = React.createContext(false);
function TooltipProvider({ delayDuration = 200, disableHoverableContent = true, children, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip$1.Provider, {
		"data-slot": "tooltip-provider",
		delayDuration,
		disableHoverableContent,
		...props,
		children: /* @__PURE__ */ jsx(ProvidedContext, {
			value: true,
			children
		})
	});
}
/** Adds a TooltipProvider only where no ancestor has one, so the app's delay and skip-delay group still apply. */
function EnsureTooltipProvider({ children }) {
	return React.useContext(ProvidedContext) ? children : /* @__PURE__ */ jsx(TooltipProvider, { children });
}
var sharedAttribute = "data-cipher-tooltip";
var rowDescribedAttribute = "data-row-described";
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
	const [rowIds, setRowIds] = React.useState(null);
	const [open, setOpen] = React.useState(false);
	const openRef = React.useRef(open);
	const holdOpen = React.useRef(false);
	React.useLayoutEffect(() => {
		openRef.current = open;
	});
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
		let focusedRow = null;
		const run = (step) => {
			if (handle.current) step(handle.current);
			else {
				pending.current.push(step);
				setMounted(true);
			}
		};
		const call = (name, event) => run((anchor) => anchor.handlers[name]?.(event));
		const attach = (target, rows = null) => {
			setRowIds(rows);
			if (!rows) focusedRow = null;
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
			if (event.pointerType === "touch") return;
			const trigger = find(event.target);
			if (trigger !== hovered) leave(event);
			if (!trigger) return;
			hovered = trigger;
			if (pressed.has(trigger)) return;
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
			const shown = openRef.current && trigger === element.current;
			if (trigger === element.current) call("onPointerDown", event);
			if (event.pointerType !== "touch" || !trigger.hasAttribute(tapAttribute)) return;
			if (shown) setOpen(false);
			else {
				closeOtherTooltips();
				attach(trigger);
				run(() => setOpen(true));
				holdOpen.current = true;
			}
		};
		const showRow = (row) => {
			const described = [...row.querySelectorAll(`[${sharedAttribute}][${rowDescribedAttribute}]`)].filter((item) => item.closest("tr") === row && find(item));
			if (!described.length) return false;
			const inView = visibleInRow(row);
			attach(described.find(inView) ?? [...row.cells].find(inView) ?? described[0], described.map((item) => item.getAttribute(sharedAttribute)));
			focusedRow = row;
			return true;
		};
		const onFocusIn = (event) => {
			if (!focusedByKeyboard()) return;
			const trigger = find(event.target);
			if (trigger) {
				if (pressed.has(trigger)) return;
				attach(trigger);
				call("onFocus", event);
				return;
			}
			if (event.target instanceof HTMLTableRowElement && showRow(event.target)) call("onFocus", event);
		};
		const onFocusOut = (event) => {
			if (element.current && (event.target === focusedRow || find(event.target) === element.current)) {
				focusedRow = null;
				call("onBlur", event);
			}
		};
		const onPointerCancel = () => {
			holdOpen.current = false;
		};
		const onClick = (event) => {
			if (holdOpen.current) setTimeout(() => {
				holdOpen.current = false;
			});
			if (element.current && find(event.target) === element.current) call("onClick", event);
		};
		store.listener = (id) => {
			const row = focusedRow;
			if (row) queueMicrotask(() => {
				if (focusedRow !== row || showRow(row)) return;
				focusedRow = null;
				setRowIds(null);
				call("onBlur", { defaultPrevented: false });
			});
			if (!element.current || element.current.getAttribute(sharedAttribute) !== id) return;
			if (store.entries.has(id)) {
				refresh();
				return;
			}
			if (row) return;
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
		document.addEventListener("pointercancel", onPointerCancel, true);
		return () => {
			store.listener = null;
			document.removeEventListener("pointermove", onPointerMove, true);
			document.removeEventListener("pointerout", onPointerOut, true);
			document.removeEventListener("pointerdown", onPointerDown, true);
			document.removeEventListener("focusin", onFocusIn, true);
			document.removeEventListener("focusout", onFocusOut, true);
			document.removeEventListener("click", onClick, true);
			document.removeEventListener("pointercancel", onPointerCancel, true);
		};
	}, [store]);
	React.useLayoutEffect(() => {
		const target = element.current;
		if (!open || !target || rowIds || target.hasAttribute("aria-describedby")) return void 0;
		target.setAttribute("aria-describedby", contentId);
		return () => target.removeAttribute("aria-describedby");
	}, [
		open,
		activeId,
		rowIds,
		contentId
	]);
	if (!mounted) return null;
	const entryId = rowIds?.[0] ?? activeId;
	const entry = entryId ? store.entries.get(entryId) : void 0;
	const rowEntries = rowIds?.flatMap((id) => {
		const item = store.entries.get(id);
		return item ? [{
			id,
			content: item.content
		}] : [];
	});
	return /* @__PURE__ */ jsxs(Tooltip$1.Root, {
		"data-slot": "tooltip",
		disableHoverableContent: true,
		open,
		onOpenChange: (next) => {
			if (!next && holdOpen.current) return;
			flushSync(() => setOpen(next));
		},
		children: [/* @__PURE__ */ jsx(Tooltip$1.Trigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx(SharedAnchor, { handle })
		}), entry && /* @__PURE__ */ jsx(TooltipContent, {
			id: contentId,
			side: entry.side,
			align: entry.align,
			sticky: rowEntries ? "always" : void 0,
			children: rowEntries ? /* @__PURE__ */ jsx("span", {
				className: cn(menu_module_default.tooltipText, menu_module_default.tooltipLines),
				children: rowEntries.map((item) => /* @__PURE__ */ jsx("span", { children: item.content }, item.id))
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
				className: menu_module_default.tooltipText,
				children: entry.content
			}), entry.shortcut && /* @__PURE__ */ jsx(Kbd, { children: entry.shortcut })] })
		})]
	});
}
/**
* Shares one tooltip among every Tooltip inside it: each trigger renders only its element, marked with
* data-cipher-tooltip, and the scope mounts a single Radix tooltip on the first hover or keyboard focus and
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
		children: [children, /* @__PURE__ */ jsx(EnsureTooltipProvider, { children: /* @__PURE__ */ jsx(SharedTooltipHost, { store }) })]
	});
}
function SharedTooltip({ store, content, shortcut, side, align, tap, children }) {
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
	return content ? React.cloneElement(children, {
		[sharedAttribute]: id,
		[tapAttribute]: tap ? "" : void 0
	}) : children;
}
function Tooltip({ content, shortcut, side = "top", align = "center", wrap: _wrap, disableHoverableContent = true, openOnTap = false, children, ...props }) {
	const store = React.useContext(TooltipScopeContext);
	const [tapOpen, setTapOpen] = React.useState(props.defaultOpen ?? false);
	const tapOpenRef = React.useRef(tapOpen);
	React.useLayoutEffect(() => {
		tapOpenRef.current = tapOpen;
	});
	const tap = openOnTap && props.open === void 0;
	const changeTapOpen = (next) => {
		setTapOpen(next);
		props.onOpenChange?.(next);
	};
	const trigger = openOnTap && React.isValidElement(children) ? React.cloneElement(children, { onClick: skipTapClick(children.props.onClick) }) : children;
	if (store && disableHoverableContent && props.open === void 0 && props.defaultOpen === void 0 && props.onOpenChange === void 0 && props.delayDuration === void 0 && React.isValidElement(children)) return /* @__PURE__ */ jsx(SharedTooltip, {
		store,
		content,
		shortcut,
		side,
		align,
		tap: openOnTap,
		children: trigger
	});
	const tooltip = /* @__PURE__ */ jsx(Tooltip$1.Root, {
		"data-slot": "tooltip",
		disableHoverableContent,
		...props,
		...tap && {
			open: tapOpen,
			onOpenChange: changeTapOpen
		},
		children: content ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
			asChild: true,
			...tap && {
				[tapAttribute]: "",
				ref: (node) => {
					if (!node) return;
					tapToggles.set(node, () => {
						if (!tapOpenRef.current) closeOtherTooltips();
						changeTapOpen(!tapOpenRef.current);
					});
				}
			},
			children: trigger
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
	return /* @__PURE__ */ jsx(EnsureTooltipProvider, { children: tooltip });
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
			if (event.pointerType === "touch" && event.currentTarget.hasAttribute(tapAttribute)) event.preventDefault();
		},
		onPointerMove: (event) => {
			onPointerMove?.(event);
			if (pressed.current) event.preventDefault();
		},
		onPointerLeave: (event) => {
			onPointerLeave?.(event);
			if (!coveredByOverlay(event.currentTarget)) pressed.current = false;
			if (event.pointerType === "touch") event.preventDefault();
		},
		onFocus: (event) => {
			onFocus?.(event);
			if (pressed.current || !focusedByKeyboard()) event.preventDefault();
		},
		...props
	});
}
TooltipTrigger.displayName = "TooltipTrigger";
function TooltipContent({ className, collisionPadding = 16, sideOffset = 0, children, ref, ...props }) {
	return /* @__PURE__ */ jsx(Tooltip$1.Portal, {
		container: usePortalContainer(),
		children: /* @__PURE__ */ jsxs(Tooltip$1.Content, {
			ref,
			"data-slot": "tooltip-content",
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
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
var interactiveRoles = /* @__PURE__ */ new Set([
	"button",
	"checkbox",
	"combobox",
	"link",
	"menuitem",
	"switch",
	"tab"
]);
/** True inside a TooltipScope, such as Table rows, where a trigger stays pass-through and needs no tab stop of its own. */
function useInTooltipScope() {
	return React.useContext(TooltipScopeContext) !== null;
}
function TooltipText({ content, side, align, asChild = false, openOnTap, className, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "span";
	const describeRow = React.useContext(RowDescriptionContext);
	const descriptionId = React.useId();
	const trigger = React.useRef(null);
	const child = asChild && React.isValidElement(props.children) ? props.children : void 0;
	const childProps = child?.props ?? {};
	const own = {
		...props,
		...childProps
	};
	const independent = typeof own.role === "string" && interactiveRoles.has(own.role) || [
		props.onClick,
		props.onKeyDown,
		childProps.onClick,
		childProps.onKeyDown
	].some(callerHandler);
	const disabled = Boolean(own.disabled);
	const passThrough = Boolean(describeRow) && !independent;
	React.useLayoutEffect(() => {
		const node = trigger.current;
		if (!describeRow) return void 0;
		const nodeDisabled = disabled || Boolean(node?.matches(":disabled"));
		if (independent && !nodeDisabled) return void 0;
		if (!nodeDisabled && node?.matches("a, button, input, select, textarea, summary, [contenteditable], [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]")) return void 0;
		const undescribe = describeRow(descriptionId);
		node?.setAttribute(rowDescribedAttribute, "");
		return () => {
			node?.removeAttribute(rowDescribedAttribute);
			undescribe();
		};
	}, [
		describeRow,
		descriptionId,
		independent,
		disabled,
		child?.type
	]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Tooltip, {
		content,
		side,
		align,
		openOnTap,
		children: /* @__PURE__ */ jsx(Comp, {
			ref: (node) => {
				trigger.current = node;
				if (typeof ref === "function") return ref(node);
				if (ref) ref.current = node;
			},
			"data-slot": "tooltip-text",
			"data-tooltip-text": independent ? void 0 : "",
			tabIndex: passThrough ? void 0 : 0,
			className: cn(controls_module_default.focusOutline, className),
			...props
		})
	}), describeRow && /* @__PURE__ */ jsx("span", {
		id: descriptionId,
		hidden: true,
		children: content
	})] });
}
TooltipText.displayName = "TooltipText";
var stretchedHost = "tr[data-stretched-link], [data-slot=\"card\"][data-stretched-link], [data-slot=\"stat-card\"][data-stretched-link]";
var ownControl = "a[href], button, input, select, textarea, summary, [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]";
/** A reason trigger sits above a row's stretched link so hovering it shows the reason, so it hands clicks on to that link, modifier keys and middle button included. A trigger that is a control of its own keeps its clicks. */
function forwardToStretchedLink(event) {
	if (event.defaultPrevented) return;
	const trigger = event.currentTarget;
	const control = event.target instanceof Element ? event.target.closest(ownControl) : null;
	if (control && trigger.contains(control)) return;
	const link = trigger.closest(stretchedHost)?.querySelector("[data-row-link], a[data-slot=\"card-link\"]");
	if (!link || trigger.contains(link) || link.contains(trigger)) return;
	const selection = window.getSelection();
	if (selection && !selection.isCollapsed && trigger.contains(selection.anchorNode)) return;
	link.dispatchEvent(new MouseEvent("click", event.nativeEvent));
}
function forwardMiddleClick(event) {
	if (event.button === 1) forwardToStretchedLink(event);
}
internalHandlers.add(forwardToStretchedLink);
internalHandlers.add(forwardMiddleClick);
/**
* Says why: Button's disabledReason and the reason on Badge and StatusText. wrap shows the reason in a
* tooltip that also opens on a tap on touch devices, adding a provider where none is above it, and with
* focusable the element becomes a TooltipText tab stop. Put
* description inside the element and pass its aria-describedby through describedBy, so the reason is
* its accessible description even while the tooltip is closed.
*/
function useReason(reason) {
	const id = React.useId();
	const active = Boolean(reason);
	return {
		active,
		describedBy: (own) => active ? [own, id].filter(Boolean).join(" ") : own,
		description: active ? /* @__PURE__ */ jsx("span", {
			id,
			hidden: true,
			children: reason
		}) : null,
		wrap: (element, focusable = false) => active ? /* @__PURE__ */ jsx(EnsureTooltipProvider, { children: focusable ? /* @__PURE__ */ jsx(TooltipText, {
			asChild: true,
			openOnTap: true,
			content: reason,
			"data-reason-trigger": "",
			onClick: forwardToStretchedLink,
			onAuxClick: forwardMiddleClick,
			children: React.cloneElement(element, { onClick: skipTapClick(element.props.onClick) })
		}) : /* @__PURE__ */ jsx(Tooltip, {
			content: reason,
			openOnTap: true,
			children: element
		}) }) : element
	};
}
export { Tooltip, TooltipContent, TooltipProvider, TooltipScope, TooltipText, TooltipTrigger, useInTooltipScope, useReason };

//# sourceMappingURL=tooltip.js.map