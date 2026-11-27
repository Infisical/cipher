"use client";
import { ChartContainer } from "./chart.js";
import { StatCardChartHeight } from "./stat-card.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Area, AreaChart, YAxis } from "recharts";
// src/ui/stat-card-chart.tsx
var headroom = 12;
var footroom = 6;
var number = new Intl.NumberFormat();
/** An area chart for a StatCard's chart slot. Its fill reaches the band's bottom edge, the line keeps 12px of headroom and stays 6px above the bottom, and it takes the band's height. Inside hueScope it draws in the product's hue. */
function StatCardChart({ data, label, curve = "linear", summary }) {
	const height = React.useContext(StatCardChartHeight);
	const points = data.map((value) => ({ value }));
	const max = Math.max(...data, 0);
	const min = Math.min(...data, 0);
	const plot = height - headroom;
	const floor = max === min ? min - 1 : min - (max - min) * footroom / (plot - footroom);
	return /* @__PURE__ */ jsx(ChartContainer, {
		config: { value: {
			label,
			color: "var(--cipher-hue-icon, var(--chart-1))"
		} },
		height,
		role: "img",
		"aria-label": `${label}: ${summary ?? describe(data)}`,
		children: /* @__PURE__ */ jsxs(AreaChart, {
			data: points,
			margin: {
				top: headroom,
				right: 0,
				bottom: 0,
				left: 0
			},
			children: [/* @__PURE__ */ jsx(YAxis, {
				hide: true,
				type: "number",
				allowDataOverflow: true,
				domain: [floor, max === min ? max + 1 : max]
			}), /* @__PURE__ */ jsx(Area, {
				dataKey: "value",
				type: curve === "step" ? "stepAfter" : "linear",
				stroke: "var(--color-value)",
				strokeWidth: 1.6,
				fill: "var(--cipher-hue-fill, var(--chart-1))",
				fillOpacity: .14,
				baseValue: floor,
				dot: false,
				activeDot: false,
				isAnimationActive: false
			})]
		})
	});
}
var describe = (data) => data.length === 0 ? "no data" : `${number.format(data[0])} to ${number.format(data[data.length - 1])}, low ${number.format(Math.min(...data))}, high ${number.format(Math.max(...data))}`;
export { StatCardChart };

//# sourceMappingURL=stat-card-chart.js.map