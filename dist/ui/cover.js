import { cn } from "../lib/utils.js";
import cover_module_default from "./cover.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/cover.tsx
var dots = Array.from({ length: 32 }, (_, index) => ({
	x: 648 + index % 8 * 16,
	y: 136 + Math.floor(index / 8) * 16
}));
function Cover({ title, tagline, className, ref, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "cover",
		className: cn(cover_module_default.cover, className),
		...props,
		children: [/* @__PURE__ */ jsxs("svg", {
			className: cover_module_default.art,
			viewBox: "480 0 480 288",
			"aria-hidden": "true",
			focusable: "false",
			children: [
				/* @__PURE__ */ jsx("rect", {
					className: cn(cover_module_default.slab, cover_module_default.block),
					x: "624",
					y: "-8",
					width: "344",
					height: "216"
				}),
				/* @__PURE__ */ jsx("rect", {
					className: cn(cover_module_default.accent, cover_module_default.block),
					x: "512",
					y: "168",
					width: "96",
					height: "96"
				}),
				/* @__PURE__ */ jsx("rect", {
					className: cn(cover_module_default.band, cover_module_default.block),
					x: "624",
					y: "224",
					width: "344",
					height: "40"
				}),
				dots.map((dot) => /* @__PURE__ */ jsx("rect", {
					className: cover_module_default.dot,
					x: dot.x,
					y: dot.y,
					width: "4",
					height: "4"
				}, `${dot.x}-${dot.y}`))
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: cover_module_default.words,
			children: [/* @__PURE__ */ jsx("h1", {
				className: cover_module_default.title,
				children: title
			}), tagline && /* @__PURE__ */ jsx("p", {
				className: cover_module_default.tagline,
				children: tagline
			})]
		})]
	});
}
Cover.displayName = "Cover";
export { Cover };

//# sourceMappingURL=cover.js.map