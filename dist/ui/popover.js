"use client";
import { useV4CollisionBoundary, useV4PortalContainer } from "../scope.js";
import { FrameScope } from "../lib/frame-context.js";
import { useOwnedEscape } from "../lib/use-owned-escape.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import menu_module_default from "./menu.module.js";
import popover_module_default from "./popover.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Popover as Popover$1, Slot } from "radix-ui";
import { GripHorizontalIcon } from "lucide-react";
// src/ui/popover.tsx
var PopoverOpenContext = React.createContext(false);
function Popover({ open, defaultOpen = false, onOpenChange, ...props }) {
	const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
	const current = open ?? uncontrolled;
	return /* @__PURE__ */ jsx(PopoverOpenContext, {
		value: current,
		children: /* @__PURE__ */ jsx(Popover$1.Root, {
			"data-slot": "popover",
			open: current,
			onOpenChange: (next) => {
				if (open === void 0) setUncontrolled(next);
				onOpenChange?.(next);
			},
			...props
		})
	});
}
function PopoverTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Popover$1.Trigger, {
		ref,
		"data-slot": "popover-trigger",
		...props
	});
}
PopoverTrigger.displayName = "PopoverTrigger";
var restingOffset = {
	x: 0,
	y: 0
};
var tabbable = "a[href], button:not([disabled]), input:not([disabled]):not([type=\"hidden\"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
var dragKeys = {
	ArrowLeft: {
		x: -1,
		y: 0
	},
	ArrowRight: {
		x: 1,
		y: 0
	},
	ArrowUp: {
		x: 0,
		y: -1
	},
	ArrowDown: {
		x: 0,
		y: 1
	}
};
function clampDragOffset(content, current, next, padding, boundary) {
	const inset = typeof padding === "number" ? {
		top: padding,
		right: padding,
		bottom: padding,
		left: padding
	} : {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		...padding
	};
	const frame = boundary?.getBoundingClientRect();
	const viewport = document.documentElement;
	const minLeft = Math.max(frame?.left ?? 0, 0) + inset.left;
	const minTop = Math.max(frame?.top ?? 0, 0) + inset.top;
	const maxRight = Math.min(frame?.right ?? Infinity, viewport.clientWidth) - inset.right;
	const maxBottom = Math.min(frame?.bottom ?? Infinity, viewport.clientHeight) - inset.bottom;
	const rect = content.getBoundingClientRect();
	const left = rect.left - current.x;
	const top = rect.top - current.y;
	return {
		x: Math.max(minLeft - left, Math.min(next.x, maxRight - left - rect.width)),
		y: Math.max(minTop - top, Math.min(next.y, maxBottom - top - rect.height))
	};
}
function PopoverContent({ className, collisionPadding = 8, align = "center", sideOffset = 4, surface = "card", draggable = false, onEscapeKeyDown, onOpenAutoFocus, style, children, ref, ...props }) {
	const escape = useOwnedEscape(ref, onEscapeKeyDown);
	const boundary = useV4CollisionBoundary();
	const open = React.useContext(PopoverOpenContext);
	const [offset, setOffset] = React.useState(restingOffset);
	const [openedFor, setOpenedFor] = React.useState(open);
	if (open !== openedFor) {
		setOpenedFor(open);
		if (open) setOffset(restingOffset);
	}
	const content = React.useRef(null);
	const pointer = React.useRef(void 0);
	const instructions = React.useId();
	const dragged = offset.x !== 0 || offset.y !== 0;
	const moveTo = (next) => {
		if (!content.current) return;
		setOffset(clampDragOffset(content.current, offset, next, collisionPadding, boundary));
	};
	const grab = (handle) => {
		content.current = handle.closest("[data-slot=\"popover-content\"]");
	};
	React.useEffect(() => {
		if (!dragged) return void 0;
		let frame = 0;
		const reclamp = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				const node = content.current;
				if (node) setOffset((current) => clampDragOffset(node, current, current, collisionPadding, boundary));
			});
		};
		window.addEventListener("resize", reclamp);
		return () => {
			cancelAnimationFrame(frame);
			window.removeEventListener("resize", reclamp);
		};
	}, [
		dragged,
		collisionPadding,
		boundary
	]);
	return /* @__PURE__ */ jsx(Popover$1.Portal, {
		container: useV4PortalContainer(),
		children: /* @__PURE__ */ jsxs(Popover$1.Content, {
			ref: escape.ref,
			"data-slot": "popover-content",
			collisionPadding,
			collisionBoundary: boundary,
			align,
			sideOffset,
			"data-surface": surface,
			"data-scroll-fade": "y",
			className: cn("z-50", menu_module_default.surface, surface === "menu" ? menu_module_default.panel : menu_module_default.card, menu_module_default.motion, className),
			style: dragged ? {
				...style,
				transform: `translate(${offset.x}px, ${offset.y}px)`
			} : style,
			...props,
			onEscapeKeyDown: escape.onEscapeKeyDown,
			onOpenAutoFocus: (event) => {
				onOpenAutoFocus?.(event);
				if (!draggable || event.defaultPrevented) return;
				event.preventDefault();
				const panel = event.currentTarget;
				(Array.from(panel.querySelectorAll(tabbable)).find((element) => element.dataset.slot !== "popover-drag-handle" && !element.closest("[hidden]")) ?? panel).focus();
			},
			children: [draggable && /* @__PURE__ */ jsxs("button", {
				type: "button",
				"data-slot": "popover-drag-handle",
				"aria-label": "Move",
				"aria-describedby": instructions,
				className: cn(popover_module_default.dragHandle, controls_module_default.focusOutline),
				onPointerDown: (event) => {
					if (event.button !== 0) return;
					grab(event.currentTarget);
					event.currentTarget.setPointerCapture(event.pointerId);
					pointer.current = {
						x: event.clientX,
						y: event.clientY,
						offset
					};
				},
				onPointerMove: (event) => {
					const start = pointer.current;
					if (!start) return;
					moveTo({
						x: start.offset.x + event.clientX - start.x,
						y: start.offset.y + event.clientY - start.y
					});
				},
				onPointerUp: () => {
					pointer.current = void 0;
				},
				onLostPointerCapture: () => {
					pointer.current = void 0;
				},
				onKeyDown: (event) => {
					const direction = dragKeys[event.key];
					if (!direction) return;
					event.preventDefault();
					grab(event.currentTarget);
					const step = parseFloat(getComputedStyle(event.currentTarget).getPropertyValue(event.shiftKey ? "--v4-space-48" : "--v4-space-8"));
					moveTo({
						x: offset.x + direction.x * step,
						y: offset.y + direction.y * step
					});
				},
				children: [/* @__PURE__ */ jsx(Icon, { icon: GripHorizontalIcon }), /* @__PURE__ */ jsx("span", {
					id: instructions,
					hidden: true,
					children: "Use the arrow keys to move the popover. Hold Shift to move it further."
				})]
			}), /* @__PURE__ */ jsx(FrameScope, {
				framed: false,
				children
			})]
		})
	});
}
PopoverContent.displayName = "PopoverContent";
function PopoverAnchor({ asChild, virtualRef, ref, ...props }) {
	const node = React.useRef(null);
	const attach = React.useCallback((element) => {
		node.current = element;
		if (typeof ref === "function") ref(element);
		else if (ref) ref.current = element;
	}, [ref]);
	const generation = React.useContext(PopoverOpenContext) ? "open" : "closed";
	if (virtualRef) return /* @__PURE__ */ jsx(Popover$1.Anchor, {
		ref,
		"data-slot": "popover-anchor",
		virtualRef,
		hidden: true,
		...props
	}, generation);
	const Comp = asChild ? Slot.Root : "div";
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Comp, {
		ref: attach,
		"data-slot": "popover-anchor",
		...props
	}), /* @__PURE__ */ jsx(Popover$1.Anchor, {
		virtualRef: node,
		hidden: true
	}, generation)] });
}
PopoverAnchor.displayName = "PopoverAnchor";
function PopoverHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "popover-header",
		className: cn("flex flex-col gap-0.5", className),
		...props
	});
}
PopoverHeader.displayName = "PopoverHeader";
function PopoverTitle({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx("h2", {
		ref,
		"data-slot": "popover-title",
		className: cn("", className),
		...props,
		children
	});
}
PopoverTitle.displayName = "PopoverTitle";
function PopoverDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "popover-description",
		className: cn("text-muted-foreground", className),
		...props
	});
}
PopoverDescription.displayName = "PopoverDescription";
export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };

//# sourceMappingURL=popover.js.map