"use client";
import { cn } from "../lib/utils.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ScrollArea as ScrollArea$1 } from "radix-ui";
// src/ui/scroll-area.tsx
function ScrollArea({ className, children, edgeBehavior = "fade", orientation = "vertical", ref, ...props }) {
	return /* @__PURE__ */ jsxs(ScrollArea$1.Root, {
		ref,
		"data-slot": "scroll-area",
		className: cn("relative", className),
		...props,
		children: [
			/* @__PURE__ */ jsx(ScrollArea$1.Viewport, {
				"data-slot": "scroll-area-viewport",
				"data-scroll-fade": edgeBehavior === "none" ? void 0 : {
					vertical: "y",
					horizontal: "x",
					both: "both"
				}[orientation],
				"data-scroll-edge": edgeBehavior === "border" ? "border" : void 0,
				tabIndex: 0,
				className: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cipher-focus-ring)] focus-visible:outline-1",
				children
			}),
			orientation !== "horizontal" && /* @__PURE__ */ jsx(ScrollBar, {}),
			orientation !== "vertical" && /* @__PURE__ */ jsx(ScrollBar, { orientation: "horizontal" }),
			/* @__PURE__ */ jsx(ScrollArea$1.Corner, {})
		]
	});
}
ScrollArea.displayName = "ScrollArea";
function ScrollBar({ className, orientation = "vertical", ref, ...props }) {
	return /* @__PURE__ */ jsx(ScrollArea$1.ScrollAreaScrollbar, {
		ref,
		"data-slot": "scroll-area-scrollbar",
		"data-orientation": orientation,
		orientation,
		className: cn("flex touch-none p-0.5 transition-opacity duration-(--cipher-duration-fast) ease-(--cipher-ease-fade) select-none data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:flex-col data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100", className),
		...props,
		children: /* @__PURE__ */ jsx(ScrollArea$1.ScrollAreaThumb, {
			"data-slot": "scroll-area-thumb",
			className: "relative flex-1 rounded-none bg-[color:var(--cipher-scroll-thumb)] hover:bg-[color:var(--cipher-scroll-thumb-hover)]"
		})
	});
}
ScrollBar.displayName = "ScrollBar";
export { ScrollArea, ScrollBar };

//# sourceMappingURL=scroll-area.js.map