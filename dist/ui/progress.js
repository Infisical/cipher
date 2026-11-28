"use client";
import { cn } from "../lib/utils.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Progress as Progress$1 } from "radix-ui";
// src/ui/progress.tsx
function Progress({ className, value, max = 100, label, valueLabel, tone = "ink", warnAt = .8, ref, ...props }) {
	const resolvedMax = Number.isFinite(max) && max > 0 ? max : 100;
	const resolvedValue = typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.min(value, resolvedMax) : null;
	const ratio = typeof value === "number" ? value / resolvedMax : 0;
	const color = tone === "auto" ? ratio >= 1 ? "bad" : ratio >= warnAt ? "warn" : "ink" : tone;
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "progress-group",
		"data-tone": color,
		className: controls_module_default.progressGroup,
		children: [(label || valueLabel) && /* @__PURE__ */ jsxs("div", {
			className: controls_module_default.progressLabels,
			children: [label && /* @__PURE__ */ jsx("span", {
				className: controls_module_default.progressLabel,
				children: label
			}), valueLabel && /* @__PURE__ */ jsx("span", {
				className: controls_module_default.progressValue,
				children: valueLabel
			})]
		}), /* @__PURE__ */ jsx(Progress$1.Root, {
			ref,
			"data-slot": "progress",
			"data-tone": tone,
			value: resolvedValue,
			max: resolvedMax,
			"aria-label": label,
			"aria-valuetext": valueLabel ?? (typeof value === "number" && value > resolvedMax ? `${value} of ${resolvedMax}, over` : void 0),
			className: cn("relative flex w-full items-center overflow-hidden", controls_module_default.progress, className),
			...props,
			children: /* @__PURE__ */ jsx(Progress$1.Indicator, {
				"data-slot": "progress-indicator",
				"data-tone": color,
				className: cn("size-full flex-1", controls_module_default.progressIndicator),
				style: { transform: `translateX(-${100 - (resolvedValue ?? 0) / resolvedMax * 100}%)` }
			})
		})]
	});
}
Progress.displayName = "Progress";
var ProgressSteps = ({ steps, current, label, showHeading = true }) => {
	const step = Math.min(current + 1, steps.length);
	const names = steps.join("\n");
	const list = React.useRef(null);
	const [compact, setCompact] = React.useState(false);
	React.useLayoutEffect(() => {
		const node = list.current;
		if (!node) return void 0;
		const check = () => setCompact([...node.children].some((item) => {
			const element = item;
			const lines = element.offsetHeight / parseFloat(getComputedStyle(element).lineHeight);
			return element.scrollWidth > element.clientWidth || lines > 2.5;
		}));
		check();
		const observer = new ResizeObserver(check);
		observer.observe(node);
		document.fonts?.addEventListener("loadingdone", check);
		return () => {
			observer.disconnect();
			document.fonts?.removeEventListener("loadingdone", check);
		};
	}, [names, current]);
	return /* @__PURE__ */ jsxs("div", {
		"data-slot": "progress-steps",
		"data-compact": compact || void 0,
		role: "group",
		"aria-label": label,
		className: cn(controls_module_default.progressGroup, controls_module_default.progressSteps),
		children: [
			showHeading && /* @__PURE__ */ jsxs("div", {
				className: controls_module_default.progressLabels,
				children: [/* @__PURE__ */ jsx("span", {
					className: controls_module_default.progressLabel,
					children: label
				}), /* @__PURE__ */ jsxs("span", {
					className: controls_module_default.progressValue,
					children: [
						"Step ",
						step,
						" of ",
						steps.length
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				role: "progressbar",
				"aria-label": label,
				"aria-valuemin": 0,
				"aria-valuemax": steps.length,
				"aria-valuenow": Math.max(0, Math.min(current, steps.length)),
				"aria-valuetext": `Step ${step} of ${steps.length}${steps[current] ? `, ${steps[current]}` : ""}`,
				className: controls_module_default.stepBars,
				children: steps.map((name, index) => /* @__PURE__ */ jsx("span", {
					className: controls_module_default.stepBar,
					"data-current": index === current || void 0,
					"data-complete": index < current || void 0
				}, `${index}-${name}`))
			}),
			/* @__PURE__ */ jsx("ol", {
				ref: list,
				className: controls_module_default.stepLabels,
				children: steps.map((name, index) => /* @__PURE__ */ jsx("li", {
					"data-current": index === current || void 0,
					"aria-current": index === current ? "step" : void 0,
					children: name
				}, `${index}-${name}`))
			}),
			compact && /* @__PURE__ */ jsx("p", {
				"aria-hidden": "true",
				className: controls_module_default.stepCompact,
				children: steps[current]
			})
		]
	});
};
export { Progress, ProgressSteps };

//# sourceMappingURL=progress.js.map