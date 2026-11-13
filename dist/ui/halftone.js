import { useScheme } from "../scope.js";
import { cn } from "../lib/utils.js";
import halftone_module_default from "./halftone.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/ui/halftone.tsx
var bayer = (size) => {
	if (size === 1) return [[0]];
	const half = bayer(size / 2);
	const span = half.length;
	return Array.from({ length: size }, (_, y) => Array.from({ length: size }, (_, x) => {
		const value = 4 * half[y % span][x % span];
		if (y < span) return x < span ? value : value + 2;
		return x < span ? value + 3 : value + 1;
	}));
};
var thresholds = bayer(8).map((row) => row.map((value) => (value + .5) / 64));
var alphaSteps = 12;
var hoverScale = 1.5;
var perlin = (seed) => {
	let state = [...String(seed)].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261);
	const random = () => {
		state = state + 1831565813 | 0;
		let value = Math.imul(state ^ state >>> 15, 1 | state);
		value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
		return ((value ^ value >>> 14) >>> 0) / 4294967296;
	};
	const table = Array.from({ length: 256 }, (_, index) => index);
	for (let index = 255; index > 0; index -= 1) {
		const swap = Math.floor(random() * (index + 1));
		[table[index], table[swap]] = [table[swap], table[index]];
	}
	const hash = (x, y) => table[table[x & 255] + y & 255];
	const gradient = (corner, x, y) => (corner & 1 ? x : -x) + (corner & 2 ? y : -y);
	const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
	return (x, y) => {
		const cellX = Math.floor(x);
		const cellY = Math.floor(y);
		const dx = x - cellX;
		const dy = y - cellY;
		const u = fade(dx);
		const top = gradient(hash(cellX, cellY), dx, dy) * (1 - u) + gradient(hash(cellX + 1, cellY), dx - 1, dy) * u;
		return top + (gradient(hash(cellX, cellY + 1), dx, dy - 1) * (1 - u) + gradient(hash(cellX + 1, cellY + 1), dx - 1, dy - 1) * u - top) * fade(dy);
	};
};
var cellPaths = (width, height, { anchor, reach, depth, density, gamma, cell, noise }) => {
	const reachY = height * depth;
	const columns = Math.ceil(Math.min(width, reach) / cell);
	const rows = Math.ceil(Math.min(height, reachY) / cell);
	const fromRight = anchor.endsWith("right");
	const fromBottom = anchor.startsWith("bottom");
	const steps = /* @__PURE__ */ new Map();
	for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
		const warp = noise ? .3 * noise(column / 5, row / 5) : 0;
		const jitter = noise ? .25 * noise(column / 2 + 31.7, row / 2 + 17.3) : 0;
		const distance = Math.hypot((column + .5) * cell / reach, (row + .5) * cell / reachY) + warp;
		const falloff = Math.min(1, Math.max(0, 1 - distance));
		const threshold = Math.min(63.5 / 64, Math.max(.5 / 64, thresholds[row % 8][column % 8] + jitter));
		if (density * falloff ** gamma <= threshold) continue;
		const step = Math.round(falloff * alphaSteps);
		if (!step) continue;
		const x = fromRight ? width - (column + 1) * cell : column * cell;
		const y = fromBottom ? height - (row + 1) * cell : row * cell;
		const path = steps.get(step) ?? [];
		path.push(`M${x} ${y}h${cell}v${cell}h-${cell}z`);
		steps.set(step, path);
	}
	return [...steps].map(([step, path]) => ({
		opacity: step / alphaSteps,
		d: path.join("")
	}));
};
var readNumber = (element, property, fallback) => {
	const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
	return Number.isFinite(value) ? value : fallback;
};
/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card spreads it into larger cells and raises its strength. */
function Halftone({ anchor = "top-right", reach = 216, depth = 1.5, density = 1, intensity = 1, tone = "hue", seed, className, style, ref, ...props }) {
	const scheme = useScheme();
	const own = React.useRef(null);
	const [box, setBox] = React.useState();
	React.useImperativeHandle(ref, () => own.current);
	React.useLayoutEffect(() => {
		const element = own.current;
		const parent = element?.parentElement;
		if (!element || !parent) return void 0;
		const measure = () => {
			const parentStyle = getComputedStyle(parent);
			const next = {
				width: parent.clientWidth,
				height: parent.clientHeight,
				top: Number.parseFloat(parentStyle.paddingTop) || 0,
				left: Number.parseFloat(parentStyle.paddingLeft) || 0,
				gamma: readNumber(element, "--cipher-halftone-gamma", 1),
				cell: Math.max(1, readNumber(element, "--cipher-size-halftone-cell", 8))
			};
			setBox((previous) => previous && Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next);
		};
		measure();
		if (typeof ResizeObserver === "undefined") return void 0;
		const observer = new ResizeObserver(measure);
		observer.observe(parent);
		return () => observer.disconnect();
	}, [scheme]);
	const layers = React.useMemo(() => {
		if (!box?.width || !box.height) return void 0;
		const noise = seed === void 0 ? void 0 : perlin(seed);
		const shared = {
			anchor,
			depth,
			gamma: box.gamma,
			noise
		};
		return {
			rest: cellPaths(box.width, box.height, {
				...shared,
				reach,
				density,
				cell: box.cell
			}),
			hover: cellPaths(box.width, box.height, {
				...shared,
				reach: reach * hoverScale,
				depth: depth * hoverScale,
				density: density * 1.25,
				cell: box.cell * hoverScale
			})
		};
	}, [
		box,
		anchor,
		reach,
		depth,
		density,
		seed
	]);
	const origin = box ? `${anchor.endsWith("right") ? box.width : 0}px ${anchor.startsWith("bottom") ? box.height : 0}px` : void 0;
	return /* @__PURE__ */ jsx("span", {
		ref: own,
		"aria-hidden": "true",
		"data-slot": "halftone",
		"data-tone": tone,
		className: cn(halftone_module_default.halftone, className),
		style: {
			...style,
			width: box?.width,
			height: box?.height,
			marginTop: box ? -box.top : void 0,
			marginLeft: box ? -box.left : void 0,
			["--halftone-intensity"]: intensity
		},
		...props,
		children: box && layers && /* @__PURE__ */ jsx("svg", {
			width: box.width,
			height: box.height,
			shapeRendering: "crispEdges",
			focusable: "false",
			children: ["rest", "hover"].map((layer) => /* @__PURE__ */ jsx("g", {
				className: halftone_module_default[layer],
				style: { transformOrigin: origin },
				children: layers[layer].map((path) => /* @__PURE__ */ jsx("path", {
					d: path.d,
					fillOpacity: path.opacity
				}, path.opacity))
			}, layer))
		})
	});
}
Halftone.displayName = "Halftone";
export { Halftone };

//# sourceMappingURL=halftone.js.map