import { cn } from "../lib/utils.js";
import runtime_module_default from "./runtime.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/spinner.tsx
var grids = {
	base: [
		"..####....####..",
		".######..######.",
		"##....####....##",
		"##.....##.....##",
		"##.....##.....##",
		"##....####....##",
		".######..######.",
		"..####....####.."
	],
	page: [
		".....######..........######.....",
		"...##########......##########...",
		"..############....############..",
		".##############..##############.",
		".####......##########......####.",
		"####........########........####",
		"####.........######.........####",
		"####..........####..........####",
		"####..........####..........####",
		"####.........######.........####",
		"####........########........####",
		".####......##########......####.",
		".##############..##############.",
		"..############....############..",
		"...##########......##########...",
		".....######..........######....."
	]
};
var useAfterDelay = (delay) => {
	const [shown, setShown] = React.useState(delay <= 0);
	React.useEffect(() => {
		if (delay <= 0) {
			setShown(true);
			return;
		}
		setShown(false);
		const timer = window.setTimeout(() => setShown(true), delay);
		return () => window.clearTimeout(timer);
	}, [delay]);
	return shown;
};
function Spinner({ size = "inline", label, description, delay = 0, className, ref, ...props }) {
	const shown = useAfterDelay(delay);
	const grid = grids[size === "page" ? "page" : "base"];
	const pitch = size === "page" ? 5 : size === "base" ? 3 : 1;
	const dot = size === "page" ? 4 : size === "base" ? 2 : 1;
	const width = (grid[0].length - 1) * pitch + dot;
	const height = (grid.length - 1) * pitch + dot;
	if (!shown) return null;
	const mark = size === "inline" ? /* @__PURE__ */ jsxs("svg", {
		ref,
		"data-slot": "spinner",
		"data-size": size,
		width: 16,
		height: 8,
		viewBox: "0 0 16 8",
		className: cn(runtime_module_default.spinner, runtime_module_default.inline, label === void 0 && className),
		"aria-hidden": true,
		focusable: "false",
		...label === void 0 ? props : {},
		children: [/* @__PURE__ */ jsx("rect", {
			x: 1,
			y: 1,
			width: 6,
			height: 6
		}), /* @__PURE__ */ jsx("rect", {
			x: 9,
			y: 1,
			width: 6,
			height: 6
		})]
	}) : /* @__PURE__ */ jsx("svg", {
		ref,
		"data-slot": "spinner",
		"data-size": size,
		width,
		height,
		viewBox: `0 0 ${width} ${height}`,
		className: cn(runtime_module_default.spinner, runtime_module_default[size], label === void 0 && className),
		"aria-hidden": true,
		focusable: "false",
		...label === void 0 ? props : {},
		children: grid.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "#" ? [/* @__PURE__ */ jsx("rect", {
			x: x * pitch,
			y: y * pitch,
			width: dot,
			height: dot,
			"data-cross": Math.abs(x + y + 1 - (grid[0].length + grid.length) / 2) <= (size === "page" ? 2 : 1) && Math.abs(x - y - (grid[0].length - grid.length) / 2) <= (size === "page" ? 2 : 1) ? "" : void 0,
			style: { animationDelay: (() => {
				const columns = grid[0].length;
				const centerY = grid.length / 2;
				const right = x + .5 > columns / 2;
				const angle = Math.atan2(y + .5 - centerY, x + .5 - columns * (right ? .7276 : .2724)) * 180 / Math.PI;
				const phase = right ? ((angle - 180) % 360 + 360) % 360 / 720 : .5 + (-angle % 360 + 360) % 360 / 720;
				const steps = size === "page" ? 40 : 24;
				const snapped = Math.floor(phase * steps) / steps;
				return size === "page" ? `${Math.hypot(x - columns / 2, y - centerY) * .02}s, ${.95 + snapped * 2.4}s` : `${-(1 - snapped) * 1.6}s`;
			})() }
		}, `${x}-${y}`)] : []))
	});
	if (label === void 0) return mark;
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "spinner-status",
		"data-size": size,
		role: "status",
		"aria-live": "polite",
		className: cn(runtime_module_default.status, size === "inline" && runtime_module_default.statusInline, size === "page" && runtime_module_default.statusPage, className),
		...props,
		children: [
			mark,
			/* @__PURE__ */ jsx("span", {
				className: runtime_module_default.statusLabel,
				children: label
			}),
			description && size === "page" && /* @__PURE__ */ jsx("span", {
				className: runtime_module_default.statusDescription,
				children: description
			})
		]
	});
}
Spinner.displayName = "Spinner";
export { Spinner };

//# sourceMappingURL=spinner.js.map