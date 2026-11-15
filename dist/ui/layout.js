import { cn } from "../lib/utils.js";
import detail_layout_module_default from "./detail-layout.module.js";
import text_module_default from "./text.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/layout.tsx
function PageMeasure({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "page-measure",
		className: cn(text_module_default.measurePage, className),
		...props
	});
}
PageMeasure.displayName = "PageMeasure";
function FormMeasure({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "form-measure",
		className: cn(text_module_default.measureForm, className),
		...props
	});
}
FormMeasure.displayName = "FormMeasure";
var spacing = (gap) => gap === 0 ? 0 : `var(--cipher-space-${gap})`;
var alignment = (align) => align === "start" ? "flex-start" : align === "end" ? "flex-end" : align;
function Stack({ gap = 16, align = "stretch", justify = "start", style, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "stack",
		className: cn(text_module_default.stack, className),
		style: {
			gap: spacing(gap),
			alignItems: alignment(align),
			justifyContent: justify === "between" ? "space-between" : alignment(justify),
			...style
		},
		...props
	});
}
Stack.displayName = "Stack";
function Inline({ gap = 8, align = "center", justify = "start", wrap = true, style, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "inline",
		className: cn(text_module_default.inline, className),
		style: {
			gap: spacing(gap),
			alignItems: alignment(align),
			justifyContent: justify === "between" ? "space-between" : alignment(justify),
			flexWrap: wrap ? "wrap" : "nowrap",
			...style
		},
		...props
	});
}
Inline.displayName = "Inline";
/** An Inline child that takes the row's leftover width, such as a field beside buttons that hug their labels. */
function InlineGrow({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "inline-grow",
		className: cn(text_module_default.inlineGrow, className),
		...props
	});
}
InlineGrow.displayName = "InlineGrow";
function Grid({ gap = 16, columns, min = "tile", style, className, ref, ...props }) {
	let gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, var(--cipher-size-${min}-min)), 1fr))`;
	if (columns === "1:2") gridTemplateColumns = "minmax(0, 1fr) minmax(0, 2fr)";
	else if (columns) gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "grid",
		"data-columns": columns,
		className: cn(text_module_default.grid, columns === "1:2" && text_module_default.gridSplit, className),
		style: {
			gap: spacing(gap),
			gridTemplateColumns,
			...style
		},
		...props
	});
}
Grid.displayName = "Grid";
function Container({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "container",
		className: cn(text_module_default.container, className),
		...props
	});
}
Container.displayName = "Container";
function Measure({ size = "prose", className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "measure",
		"data-size": size,
		className: cn(size === "page" ? text_module_default.measurePage : size === "form" ? text_module_default.measureForm : text_module_default.measureProse, className),
		...props
	});
}
Measure.displayName = "Measure";
var scrollParent = (node) => {
	for (let parent = node.parentElement; parent; parent = parent.parentElement) if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) return parent;
	return null;
};
function DetailLayout({ aside, asideLabel, children, className, ref, ...props }) {
	const asideRef = React.useRef(null);
	const [fits, setFits] = React.useState(false);
	React.useLayoutEffect(() => {
		const node = asideRef.current;
		if (!node) return void 0;
		const scroller = scrollParent(node);
		const measure = () => {
			const style = getComputedStyle(node);
			const room = (scroller ? scroller.clientHeight : window.innerHeight) - (parseFloat(style.scrollMarginTop) || 0) - (parseFloat(style.scrollMarginBottom) || 0);
			setFits(node.offsetHeight <= room);
		};
		measure();
		window.addEventListener("resize", measure);
		if (typeof ResizeObserver === "undefined") return () => window.removeEventListener("resize", measure);
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		if (scroller) observer.observe(scroller);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, []);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "detail-layout",
		className: cn(detail_layout_module_default.root, className),
		...props,
		children: /* @__PURE__ */ jsxs("div", {
			className: detail_layout_module_default.columns,
			children: [/* @__PURE__ */ jsx("aside", {
				ref: asideRef,
				"data-slot": "detail-layout-aside",
				"data-sticky": fits || void 0,
				"aria-label": asideLabel,
				className: detail_layout_module_default.aside,
				children: aside
			}), /* @__PURE__ */ jsx("div", {
				"data-slot": "detail-layout-main",
				className: detail_layout_module_default.main,
				children
			})]
		})
	});
}
DetailLayout.displayName = "DetailLayout";
export { Container, DetailLayout, FormMeasure, Grid, Inline, InlineGrow, Measure, PageMeasure, Stack };

//# sourceMappingURL=layout.js.map