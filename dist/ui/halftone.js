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
var phases = 6;
var overshoot = 1.35;
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
var cellPaths = (width, height, { anchor, reach, depth, density, gamma, cell, limit, noise }) => {
	const reachX = Math.min(reach, limit.width);
	const reachY = Math.min(height * depth, limit.height);
	const columns = Math.ceil(Math.min(width, reachX) / cell);
	const rows = Math.ceil(Math.min(height, reachY) / cell);
	const fromRight = anchor.endsWith("right");
	const fromBottom = anchor.startsWith("bottom");
	const steps = /* @__PURE__ */ new Map();
	for (let row = 0; row < rows; row += 1) for (let column = 0; column < columns; column += 1) {
		const warp = noise ? .3 * noise(column / 5, row / 5) : 0;
		const jitter = noise ? .25 * noise(column / 2 + 31.7, row / 2 + 17.3) : 0;
		const distance = Math.hypot((column + .5) * cell / reachX, (row + .5) * cell / reachY) + warp;
		const falloff = Math.min(1, Math.max(0, 1 - distance));
		const threshold = Math.min(63.5 / 64, Math.max(.5 / 64, thresholds[row % 8][column % 8] + jitter));
		if (density * falloff ** gamma <= threshold) continue;
		const step = Math.round(falloff * alphaSteps);
		if (!step) continue;
		const x = fromRight ? width - (column + 1) * cell : column * cell;
		const y = fromBottom ? height - (row + 1) * cell : row * cell;
		const wave = (column + row) / 3 + (noise ? 2 * noise(column / 4 + 7.1, row / 4 + 3.9) : 0);
		const phase = (Math.floor(wave) % phases + phases) % phases;
		const key = `${step}-${phase}`;
		const path = steps.get(key) ?? {
			opacity: step / alphaSteps,
			phase,
			d: []
		};
		path.d.push(`M${x} ${y}h${cell}v${cell}h-${cell}z`);
		steps.set(key, path);
	}
	return [...steps].map(([key, path]) => ({
		...path,
		key,
		d: path.d.join("")
	}));
};
var readNumber = (element, property, fallback) => {
	const value = Number.parseFloat(getComputedStyle(element).getPropertyValue(property));
	return Number.isFinite(value) ? value : fallback;
};
/** Ordered-dither corner wash. Place it as the first child of the surface it decorates; it sizes itself to that parent and sits under its content. Inside a Card, hovering the card grows the wash outward from its anchor at the same cell size and raises its strength. */
function Halftone({ anchor = "top-right", reach = 216, depth = 1.5, density = 1, intensity = 1, tone = "hue", seed, bounds = "surface", size, reveal = "always", ambient = false, className, style, ref, ...props }) {
	const scheme = useScheme();
	const own = React.useRef(null);
	const [box, setBox] = React.useState();
	React.useImperativeHandle(ref, () => own.current);
	React.useLayoutEffect(() => {
		const element = own.current;
		const parent = element?.parentElement;
		if (!element || !parent) return void 0;
		const header = bounds === "header" && anchor.startsWith("top") ? parent.querySelector(":scope > [data-slot=\"card-header\"], :scope > [data-slot=\"card-inset\"] > [data-slot=\"card-header\"]") : null;
		const measure = () => {
			const parentStyle = getComputedStyle(parent);
			const cell = Math.max(1, readNumber(element, "--cipher-size-halftone-cell", 8));
			const cap = size ? size * cell : Infinity;
			const headerBottom = header ? header.getBoundingClientRect().bottom - parent.getBoundingClientRect().top - parent.clientTop : Infinity;
			const next = {
				width: parent.clientWidth,
				height: parent.clientHeight,
				top: Number.parseFloat(parentStyle.paddingTop) || 0,
				left: Number.parseFloat(parentStyle.paddingLeft) || 0,
				gamma: readNumber(element, "--cipher-halftone-gamma", 1),
				cell,
				limitWidth: Math.min(parent.clientWidth, cap),
				limitHeight: Math.round(Math.min(parent.clientHeight, cap, headerBottom))
			};
			setBox((previous) => previous && Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next);
		};
		measure();
		if (typeof ResizeObserver === "undefined") return void 0;
		const observer = new ResizeObserver(measure);
		observer.observe(parent);
		if (header) observer.observe(header);
		return () => observer.disconnect();
	}, [
		scheme,
		bounds,
		size,
		anchor
	]);
	const layers = React.useMemo(() => {
		if (!box?.width || !box.height) return void 0;
		const noise = seed === void 0 ? void 0 : perlin(seed);
		const limit = {
			width: box.limitWidth,
			height: box.limitHeight
		};
		const shared = {
			anchor,
			depth,
			gamma: box.gamma,
			limit,
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
				cell: box.cell
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
	const extent = (scale) => box && {
		x: Math.min(reach * scale, box.limitWidth) * overshoot + box.cell,
		y: Math.min(box.height * depth * scale, box.limitHeight) * overshoot + box.cell
	};
	const rest = reveal === "hover" ? {
		x: 0,
		y: 0
	} : extent(1);
	const grown = extent(hoverScale);
	return /* @__PURE__ */ jsx("span", {
		ref: own,
		"aria-hidden": "true",
		"data-slot": "halftone",
		"data-tone": tone,
		"data-reveal": reveal === "hover" ? "hover" : void 0,
		className: cn(halftone_module_default.halftone, className),
		style: {
			...style,
			width: box?.width,
			height: box?.height,
			marginTop: box ? -box.top : void 0,
			marginLeft: box ? -box.left : void 0,
			["--halftone-intensity"]: intensity,
			...box && rest && grown && {
				["--halftone-at"]: `${anchor.endsWith("right") ? box.width : 0}px ${anchor.startsWith("bottom") ? box.height : 0}px`,
				["--halftone-rest"]: `${rest.x}px ${rest.y}px`,
				["--halftone-grown"]: `${grown.x}px ${grown.y}px`
			}
		},
		...props,
		children: box && layers && ["rest", "hover"].map((layer) => /* @__PURE__ */ jsx("svg", {
			width: box.width,
			height: box.height,
			shapeRendering: "crispEdges",
			focusable: "false",
			className: halftone_module_default[layer],
			children: layers[layer].map((path) => /* @__PURE__ */ jsx("path", {
				d: path.d,
				fillOpacity: path.opacity,
				className: ambient ? halftone_module_default.ambient : void 0,
				style: ambient ? { animationDelay: `calc(var(--halftone-wave) * ${-path.phase / phases})` } : void 0
			}, path.key))
		}, layer))
	});
}
Halftone.displayName = "Halftone";
export { Halftone };

//# sourceMappingURL=halftone.js.map