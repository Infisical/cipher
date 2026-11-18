import { cn } from "../lib/utils.js";
import { Card, CardContent, CardLink } from "./card.js";
import { Icon } from "./icon.js";
import { Media } from "./item.js";
import { Skeleton } from "./skeleton.js";
import { StatusText } from "./text.js";
import stat_card_module_default from "./stat-card.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
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
function StatCard({ label, value, icon, tone, delta, trend = "flat", deltaTone, note, link, loading = false, error, variant = "framed", className, ...props }) {
	const id = React.useId();
	const labelId = `${id}-label`;
	const valueId = `${id}-value`;
	const failed = error !== void 0 && error !== null && error !== false;
	return /* @__PURE__ */ jsx(Card, {
		"data-slot": "stat-card",
		role: "group",
		"aria-labelledby": labelId,
		"aria-busy": loading || void 0,
		variant,
		className: cn(stat_card_module_default.statCard, className),
		...props,
		children: /* @__PURE__ */ jsxs(CardContent, {
			className: stat_card_module_default.body,
			children: [
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
				loading ? /* @__PURE__ */ jsx(Skeleton, { className: stat_card_module_default.valueSkeleton }) : failed ? /* @__PURE__ */ jsx(StatusText, {
					tone: "bad",
					icon: "alert",
					className: stat_card_module_default.error,
					children: error
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
				})
			]
		})
	});
}
export { StatCard };

//# sourceMappingURL=stat-card.js.map