"use client";
import { cn } from "../lib/utils.js";
import { Card, CardContent, CardLink } from "./card.js";
import { Icon } from "./icon.js";
import { Media } from "./item.js";
import { Skeleton } from "./skeleton.js";
import { StatusText } from "./text.js";
import stat_card_module_default from "./stat-card.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/stat-card.tsx
var trendIcon = {
	up: "arrow-up",
	down: "arrow-down",
	flat: "minus"
};
var trendTone = {
	up: "ok",
	down: "bad",
	flat: "neutral"
};
var chartHeight = {
	sm: 92,
	md: 168
};
/** The pixel height of the StatCard chart band the chart sits in, for chart components that fill it. */
var StatCardChartHeight = React.createContext(chartHeight.sm);
function StatCard({ label, value, icon, tone, delta, trend = "flat", deltaTone, note, link, loading = false, error, action, chart, chartPlacement = "inset", chartSize = "sm", footer, footerPlacement, variant = "framed", className, ...props }) {
	const id = React.useId();
	const labelId = `${id}-label`;
	const valueId = `${id}-value`;
	const failed = error !== void 0 && error !== null && error !== false;
	const body = /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: stat_card_module_default.head,
			children: [/* @__PURE__ */ jsx("span", {
				id: labelId,
				className: stat_card_module_default.label,
				children: link ? /* @__PURE__ */ jsx(CardLink, {
					link,
					"aria-describedby": valueId,
					children: label
				}) : label
			}), icon && /* @__PURE__ */ jsx(Media, {
				icon,
				size: "sm",
				tone,
				"aria-hidden": true
			})]
		}),
		loading ? /* @__PURE__ */ jsx(Skeleton, { className: stat_card_module_default.valueSkeleton }) : failed ? /* @__PURE__ */ jsx("div", {
			className: stat_card_module_default.error,
			children: /* @__PURE__ */ jsx(StatusText, {
				tone: "bad",
				icon: "alert",
				children: error
			})
		}) : /* @__PURE__ */ jsx("div", {
			id: valueId,
			"data-slot": "stat-card-value",
			className: stat_card_module_default.value,
			children: value
		}),
		!loading && !failed && (delta !== void 0 || note !== void 0) && /* @__PURE__ */ jsxs("div", {
			className: stat_card_module_default.foot,
			children: [delta !== void 0 && /* @__PURE__ */ jsxs("span", {
				"data-slot": "stat-card-delta",
				"data-tone": deltaTone ?? trendTone[trend],
				className: stat_card_module_default.delta,
				children: [/* @__PURE__ */ jsx(Icon, {
					name: trendIcon[trend],
					"aria-hidden": true
				}), delta]
			}), note !== void 0 && /* @__PURE__ */ jsx("span", {
				className: stat_card_module_default.note,
				children: note
			})]
		}),
		!loading && !failed && action !== void 0 && /* @__PURE__ */ jsx("div", {
			className: stat_card_module_default.action,
			children: action
		}),
		!loading && !failed && chart !== void 0 && /* @__PURE__ */ jsx("div", {
			"data-slot": "stat-card-chart",
			"data-placement": chartPlacement,
			className: stat_card_module_default.chart,
			style: { height: chartHeight[chartSize] },
			children: /* @__PURE__ */ jsx(StatCardChartHeight, {
				value: chartHeight[chartSize],
				children: chart
			})
		})
	] });
	return /* @__PURE__ */ jsx(Card, {
		"data-slot": "stat-card",
		role: "group",
		"aria-labelledby": labelId,
		"aria-busy": loading || void 0,
		variant,
		footer,
		footerPlacement,
		className: cn(stat_card_module_default.statCard, className),
		...props,
		children: footer === void 0 ? /* @__PURE__ */ jsx(CardContent, {
			className: stat_card_module_default.body,
			children: body
		}) : /* @__PURE__ */ jsx("div", {
			className: stat_card_module_default.body,
			children: body
		})
	});
}
export { StatCard, StatCardChartHeight };

//# sourceMappingURL=stat-card.js.map