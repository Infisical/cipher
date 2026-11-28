"use client";
import { cn } from "../lib/utils.js";
import { Tooltip, TooltipProvider } from "./tooltip.js";
import { worldMapCountries, worldMapFrame } from "./world-map-geometry.js";
import { equalEarth } from "./world-map-projection.js";
import world_map_module_default from "./world-map.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/world-map.tsx
var steps = 4;
var markerMin = 7;
var defaultFormat = (count) => `${count.toLocaleString("en-US")} ${count === 1 ? "access" : "accesses"}`;
var regionNames = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], {
	type: "region",
	fallback: "code"
}) : null;
var drawn = new Set(worldMapCountries.map(([code]) => code).filter(Boolean));
var regionKey = (code) => `region:${code}`;
var regionName = (code) => {
	try {
		return regionNames?.of(code) ?? code;
	} catch {
		return code;
	}
};
/** Projects a longitude and latitude into the WorldMap viewBox. */
function projectWorldMap(lng, lat) {
	const [x, y] = equalEarth(lng, lat);
	return [worldMapFrame.x + x * worldMapFrame.scale, worldMapFrame.y - y * worldMapFrame.scale];
}
function WorldMap({ locations, label, display = "both", formatCount = defaultFormat, legendLimit = 8, legend = true, empty = "No locations", className, ...props }) {
	const counted = React.useMemo(() => locations.filter((location) => location.count > 0).map((location) => ({
		...location,
		key: `location:${location.id ?? location.label}`
	})).sort((a, b) => b.count - a.count), [locations]);
	const total = counted.reduce((sum, location) => sum + location.count, 0);
	const markers = React.useMemo(() => {
		const placed = counted.filter((location) => Number.isFinite(location.lat) && Number.isFinite(location.lng) && (display !== "regions" || !drawn.has(location.country?.toUpperCase() ?? "")));
		const max = placed[0]?.count ?? 1;
		return placed.map((location) => {
			const [x, y] = projectWorldMap(location.lng, location.lat);
			const size = markerMin + Math.sqrt(location.count / max) * 13;
			return {
				...location,
				name: location.label,
				x,
				y,
				size
			};
		});
	}, [counted, display]);
	const regions = React.useMemo(() => {
		const totals = /* @__PURE__ */ new Map();
		if (display !== "markers") counted.forEach((location) => {
			const code = location.country?.toUpperCase();
			if (code && drawn.has(code)) totals.set(code, (totals.get(code) ?? 0) + location.count);
		});
		const max = Math.max(1, ...totals.values());
		return {
			totals,
			step: (count) => Math.max(1, Math.ceil(count / max * steps))
		};
	}, [counted, display]);
	const targets = React.useMemo(() => display === "regions" ? [...[...regions.totals].map(([code, count]) => ({
		key: regionKey(code),
		name: regionName(code),
		count
	})), ...markers].sort((a, b) => b.count - a.count) : markers, [
		display,
		markers,
		regions
	]);
	const [focused, setFocused] = React.useState();
	const active = Math.max(0, targets.findIndex((target) => target.key === focused));
	const elements = React.useRef(/* @__PURE__ */ new Map());
	const onKeyDown = (event) => {
		const last = targets.length - 1;
		const next = {
			ArrowRight: Math.min(active + 1, last),
			ArrowDown: Math.min(active + 1, last),
			ArrowLeft: Math.max(active - 1, 0),
			ArrowUp: Math.max(active - 1, 0),
			Home: 0,
			End: last
		}[event.key];
		if (next === void 0 || last < 0) return;
		event.preventDefault();
		setFocused(targets[next].key);
		elements.current.get(targets[next].key)?.focus();
	};
	const targetProps = (target) => ({
		ref: (element) => {
			if (element) elements.current.set(target.key, element);
			else elements.current.delete(target.key);
		},
		role: "img",
		"aria-label": `${target.name}: ${formatCount(target.count)}`,
		tabIndex: target.key === targets[active]?.key ? 0 : -1,
		onFocus: () => setFocused(target.key)
	});
	const tip = (target) => /* @__PURE__ */ jsxs("span", {
		className: world_map_module_default.tip,
		children: [
			/* @__PURE__ */ jsx("span", {
				className: world_map_module_default.tipName,
				children: target.name
			}),
			" ",
			/* @__PURE__ */ jsx("span", {
				className: world_map_module_default.tipCount,
				children: formatCount(target.count)
			})
		]
	});
	const listed = counted.slice(0, legendLimit);
	const rest = counted.slice(legendLimit).reduce((sum, location) => sum + location.count, 0);
	const summary = counted.length ? `${counted.length} ${counted.length === 1 ? "location" : "locations"}, ${formatCount(total)}` : String(typeof empty === "string" ? empty : "No locations");
	return /* @__PURE__ */ jsx(TooltipProvider, { children: /* @__PURE__ */ jsxs("div", {
		"data-slot": "world-map",
		className: cn(world_map_module_default.root, className),
		...props,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: world_map_module_default.canvas,
				"data-empty": counted.length ? void 0 : "",
				children: [/* @__PURE__ */ jsxs("svg", {
					className: world_map_module_default.svg,
					viewBox: `0 0 ${worldMapFrame.width} ${worldMapFrame.height}`,
					role: "group",
					"aria-label": label,
					onKeyDown,
					children: [/* @__PURE__ */ jsx("g", {
						className: world_map_module_default.land,
						"aria-hidden": display === "regions" ? void 0 : true,
						children: worldMapCountries.map(([code, d], index) => {
							const count = code ? regions.totals.get(code) : void 0;
							if (!count) return /* @__PURE__ */ jsx("path", { d }, code || index);
							const target = {
								key: regionKey(code),
								name: regionName(code),
								count
							};
							const region = /* @__PURE__ */ jsx("path", {
								d,
								className: world_map_module_default.region,
								"data-step": regions.step(count),
								...display === "regions" ? targetProps(target) : {}
							}, code);
							return /* @__PURE__ */ jsx(Tooltip, {
								content: tip(target),
								children: region
							}, code);
						})
					}), markers.length > 0 && /* @__PURE__ */ jsx("g", {
						className: world_map_module_default.markers,
						children: markers.map((marker) => /* @__PURE__ */ jsx(Tooltip, {
							content: tip(marker),
							children: /* @__PURE__ */ jsx("rect", {
								...targetProps(marker),
								className: world_map_module_default.marker,
								x: marker.x - marker.size / 2,
								y: marker.y - marker.size / 2,
								width: marker.size,
								height: marker.size
							})
						}, marker.key))
					})]
				}), !counted.length && /* @__PURE__ */ jsx("div", {
					className: world_map_module_default.empty,
					children: /* @__PURE__ */ jsx("span", { children: empty })
				})]
			}),
			legend && counted.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: world_map_module_default.legend,
				children: [/* @__PURE__ */ jsxs("ul", {
					className: world_map_module_default.list,
					children: [listed.map((location) => {
						const placed = markers.some((marker) => marker.key === location.key);
						return /* @__PURE__ */ jsxs("li", {
							className: world_map_module_default.item,
							children: [
								/* @__PURE__ */ jsx("span", {
									className: world_map_module_default.swatch,
									"data-kind": placed ? "marker" : "none",
									"aria-hidden": true
								}),
								/* @__PURE__ */ jsx("span", {
									className: world_map_module_default.name,
									children: location.label
								}),
								/* @__PURE__ */ jsx("span", {
									className: world_map_module_default.count,
									children: formatCount(location.count)
								})
							]
						}, location.key);
					}), rest > 0 && /* @__PURE__ */ jsxs("li", {
						className: world_map_module_default.item,
						children: [/* @__PURE__ */ jsxs("span", {
							className: world_map_module_default.name,
							children: [counted.length - legendLimit, " more"]
						}), /* @__PURE__ */ jsx("span", {
							className: world_map_module_default.count,
							children: formatCount(rest)
						})]
					})]
				}), display !== "markers" && regions.totals.size > 0 && /* @__PURE__ */ jsxs("div", {
					className: world_map_module_default.scale,
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ jsx("span", { children: "Fewer" }),
						Array.from({ length: steps }, (_, step) => /* @__PURE__ */ jsx("span", {
							className: world_map_module_default.step,
							"data-step": step + 1
						}, step)),
						/* @__PURE__ */ jsx("span", { children: "More" })
					]
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "sr-only",
				"aria-live": "polite",
				children: summary
			})
		]
	}) });
}
export { WorldMap, projectWorldMap };

//# sourceMappingURL=world-map.js.map