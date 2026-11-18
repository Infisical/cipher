import { cn } from "../lib/utils.js";
import share_bar_module_default from "./share-bar.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/share-bar.tsx
var series = [
	"var(--cipher-chart-1)",
	"var(--cipher-chart-2)",
	"var(--cipher-chart-3)",
	"var(--cipher-chart-4)",
	"var(--cipher-chart-5)",
	"var(--cipher-chart-6)"
];
var defaultFormat = (value) => value.toLocaleString();
var percent = (value, total) => {
	if (value <= 0 || total <= 0) return "0%";
	const share = value / total * 100;
	if (share < 1) return "<1%";
	if (share > 99 && value < total) return ">99%";
	return `${Math.round(share)}%`;
};
function ShareBar({ items, label, total, format = defaultFormat, legend = true, max = series.length, otherLabel = "Other", empty = "No data", className, ...props }) {
	const id = React.useId();
	const [open, setOpen] = React.useState(false);
	const clean = items.map((item) => ({
		...item,
		value: Number.isFinite(item.value) && item.value > 0 ? item.value : 0
	}));
	const sum = clean.reduce((acc, item) => acc + item.value, 0);
	const whole = typeof total === "number" && Number.isFinite(total) && total > sum ? total : sum;
	const limit = Math.max(2, Math.floor(max));
	const folded = clean.length > limit ? new Set([...clean].sort((a, b) => b.value - a.value).slice(limit - 1).map((item) => item.id)) : /* @__PURE__ */ new Set();
	const shown = clean.filter((item) => !folded.has(item.id));
	const rest = clean.filter((item) => folded.has(item.id));
	const rows = [...shown.map((item, index) => ({
		...item,
		color: item.color ?? series[index % series.length],
		other: false
	})), ...rest.length ? [{
		id: "__other",
		label: `${otherLabel} (${rest.length})`,
		value: rest.reduce((acc, item) => acc + item.value, 0),
		color: void 0,
		other: true
	}] : []];
	const summary = whole > 0 ? `${label}: ${rows.filter((row) => row.value > 0).map((row) => `${row.label} ${percent(row.value, whole)}`).join(", ")}` : `${label}: ${typeof empty === "string" ? empty : "no data"}`;
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "share-bar",
		className: cn(share_bar_module_default.root, className),
		...props,
		children: [/* @__PURE__ */ jsxs("div", {
			role: "img",
			"aria-label": summary,
			className: share_bar_module_default.bar,
			children: [rows.map((row) => row.value > 0 ? /* @__PURE__ */ jsx("span", {
				className: share_bar_module_default.segment,
				"data-other": row.other || void 0,
				style: {
					flexGrow: row.value / whole,
					background: row.color
				}
			}, row.id) : null), whole > sum && sum > 0 && /* @__PURE__ */ jsx("span", {
				className: share_bar_module_default.remainder,
				style: { flexGrow: (whole - sum) / whole }
			})]
		}), legend && (whole > 0 ? /* @__PURE__ */ jsxs("ul", {
			className: share_bar_module_default.legend,
			children: [rows.map((row) => /* @__PURE__ */ jsxs(React.Fragment, { children: [/* @__PURE__ */ jsxs("li", {
				className: share_bar_module_default.entry,
				children: [
					/* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.swatch,
						"data-other": row.other || void 0,
						style: { background: row.color }
					}),
					row.other ? /* @__PURE__ */ jsx("button", {
						type: "button",
						className: cn(share_bar_module_default.name, share_bar_module_default.toggle),
						"aria-expanded": open,
						"aria-controls": `${id}-folded`,
						onClick: () => setOpen((value) => !value),
						children: row.label
					}) : /* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.name,
						children: row.label
					}),
					/* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.share,
						children: percent(row.value, whole)
					}),
					/* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.count,
						children: format(row.value)
					})
				]
			}), row.other && /* @__PURE__ */ jsx("li", {
				id: `${id}-folded`,
				hidden: !open,
				className: share_bar_module_default.foldedGroup,
				children: /* @__PURE__ */ jsx("ul", {
					className: share_bar_module_default.folded,
					children: rest.map((item) => /* @__PURE__ */ jsxs("li", {
						className: share_bar_module_default.entry,
						children: [
							/* @__PURE__ */ jsx("span", {}),
							/* @__PURE__ */ jsx("span", {
								className: share_bar_module_default.name,
								children: item.label
							}),
							/* @__PURE__ */ jsx("span", {
								className: share_bar_module_default.share,
								children: percent(item.value, whole)
							}),
							/* @__PURE__ */ jsx("span", {
								className: share_bar_module_default.count,
								children: format(item.value)
							})
						]
					}, item.id))
				})
			})] }, row.id)), /* @__PURE__ */ jsxs("li", {
				className: cn(share_bar_module_default.entry, share_bar_module_default.total),
				children: [
					/* @__PURE__ */ jsx("span", {}),
					/* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.name,
						children: "Total"
					}),
					/* @__PURE__ */ jsx("span", {}),
					/* @__PURE__ */ jsx("span", {
						className: share_bar_module_default.count,
						children: format(whole)
					})
				]
			})]
		}) : /* @__PURE__ */ jsx("p", {
			className: share_bar_module_default.empty,
			children: empty
		}))]
	});
}
ShareBar.displayName = "ShareBar";
export { ShareBar };

//# sourceMappingURL=share-bar.js.map