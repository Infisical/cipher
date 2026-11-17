"use client";
import { useCollisionBoundary, usePortalContainer } from "../scope.js";
import { FrameScope } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import menu_module_default from "./menu.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
import { HoverCard as HoverCard$1 } from "radix-ui";
// src/ui/hover-card.tsx
function HoverCard({ ...props }) {
	return /* @__PURE__ */ jsx(HoverCard$1.Root, {
		"data-slot": "hover-card",
		...props
	});
}
function HoverCardTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(HoverCard$1.Trigger, {
		ref,
		"data-slot": "hover-card-trigger",
		...props
	});
}
HoverCardTrigger.displayName = "HoverCardTrigger";
function HoverCardContent({ className, collisionPadding = 8, align = "center", sideOffset = 4, width = "default", ref, children, ...props }) {
	return /* @__PURE__ */ jsx(HoverCard$1.Portal, {
		container: usePortalContainer(),
		"data-slot": "hover-card-portal",
		children: /* @__PURE__ */ jsx(HoverCard$1.Content, {
			ref,
			"data-slot": "hover-card-content",
			"data-width": width,
			collisionPadding,
			collisionBoundary: useCollisionBoundary(),
			align,
			sideOffset,
			className: cn("z-50", menu_module_default.surface, menu_module_default.card, menu_module_default.motion, className),
			...props,
			children: /* @__PURE__ */ jsx(FrameScope, {
				framed: false,
				children
			})
		})
	});
}
HoverCardContent.displayName = "HoverCardContent";
export { HoverCard, HoverCardContent, HoverCardTrigger };

//# sourceMappingURL=hover-card.js.map