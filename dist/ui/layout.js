"use client";
import { useListFiltered } from "../lib/list-query.js";
import { cn, truncateTitle } from "../lib/utils.js";
import { EmptyGhostScope } from "./empty.js";
import { Tabs, TabsList, TabsTrigger } from "./tabs.js";
import detail_layout_module_default from "./detail-layout.module.js";
import panes_module_default from "./panes.module.js";
import text_module_default from "./text.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
/**
* An Inline child that sets how it sits in the row. shrink={false} keeps a badge, button or
* timestamp at its own width while a sibling truncates; truncate ends plain content in an ellipsis
* on one line. A truncating row needs Inline wrap={false}, or the long child moves to its own line.
*/
function InlineItem({ shrink = true, truncate = false, title, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "inline-item",
		title: truncateTitle(truncate, title, props.children),
		className: cn(text_module_default.inlineItem, !shrink && text_module_default.inlineFixed, truncate && text_module_default.endTruncate, className),
		...props
	});
}
InlineItem.displayName = "InlineItem";
function Grid({ gap = 16, columns, min = "tile", empty, ghost, filtered: filteredProp, style, className, children, ref, ...props }) {
	const listFiltered = useListFiltered();
	const filtered = filteredProp ?? listFiltered;
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
		...props,
		children: empty !== void 0 && React.Children.toArray(children).length === 0 ? /* @__PURE__ */ jsx("div", {
			style: { gridColumn: "1 / -1" },
			children: /* @__PURE__ */ jsx(EmptyGhostScope, {
				ghost: ghost ?? (filtered ? false : "cards"),
				children: empty
			})
		}) : children
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
var PanesIdentityBlock = ({ identity }) => /* @__PURE__ */ jsxs("div", {
	"data-slot": "panes-identity",
	className: panes_module_default.identity,
	children: [identity.media, /* @__PURE__ */ jsxs("div", {
		className: panes_module_default.identityText,
		children: [
			identity.title,
			identity.description,
			identity.badges && /* @__PURE__ */ jsx("div", {
				className: panes_module_default.badges,
				children: identity.badges
			})
		]
	})]
});
var usePanesNarrow = (node) => {
	const [narrow, setNarrow] = React.useState(false);
	React.useLayoutEffect(() => {
		if (!node) return void 0;
		const measure = () => {
			const collapse = parseFloat(getComputedStyle(node).getPropertyValue("--cipher-size-pane-collapse"));
			setNarrow(node.clientWidth < (collapse || 0));
		};
		measure();
		if (typeof ResizeObserver === "undefined") return void 0;
		const observer = new ResizeObserver(measure);
		observer.observe(node);
		return () => observer.disconnect();
	}, [node]);
	return narrow;
};
var ASIDE_TAB = "aside";
var MAIN_TAB = "main";
/**
* A fixed-width aside beside a main pane inside a bounded height, such as a sheet or a dialog. The
* aside holds the identity (media, title, description, badges) above its body, each pane scrolls
* on its own, and the main pane's fields run its full width. Below size-pane-collapse the identity
* becomes a fixed header and two tabs under it switch between the aside body (asideLabel, first)
* and the main pane (mainLabel, shown first). Pass children as a function of PanesState to place
* the tabs yourself, as SheetContent does with header tabs. A page with a sidecar uses
* DetailLayout, which scrolls with the page instead.
*/
function Panes({ identity, aside, asideLabel = "Details", asideClassName, mainLabel, children, className, ref, ...props }) {
	const [node, setNode] = React.useState(null);
	const narrow = usePanesNarrow(node);
	const [detailsOpen, setDetailsOpen] = React.useState(false);
	const tabsId = React.useId();
	React.useEffect(() => {
		if (!narrow) setDetailsOpen(false);
	}, [narrow]);
	const open = narrow && detailsOpen;
	const setRef = React.useCallback((element) => {
		setNode(element);
		if (typeof ref === "function") ref(element);
		else if (ref) ref.current = element;
	}, [ref]);
	const identityBlock = identity && /* @__PURE__ */ jsx(PanesIdentityBlock, { identity });
	const main = typeof children === "function" ? children({
		narrow,
		detailsOpen: open,
		setDetailsOpen
	}) : /* @__PURE__ */ jsxs(Fragment, { children: [
		narrow && /* @__PURE__ */ jsx(Tabs, {
			"data-slot": "panes-tabs",
			className: panes_module_default.tabs,
			value: open ? ASIDE_TAB : MAIN_TAB,
			onValueChange: (value) => setDetailsOpen(value === ASIDE_TAB),
			children: /* @__PURE__ */ jsxs(TabsList, { children: [/* @__PURE__ */ jsx(TabsTrigger, {
				value: ASIDE_TAB,
				id: tabsId + ASIDE_TAB,
				"aria-controls": tabsId + "asidepanel",
				children: asideLabel
			}), /* @__PURE__ */ jsx(TabsTrigger, {
				value: MAIN_TAB,
				id: tabsId + MAIN_TAB,
				"aria-controls": tabsId + "mainpanel",
				children: mainLabel
			})] })
		}),
		narrow && /* @__PURE__ */ jsx("div", {
			"data-slot": "panes-details",
			role: "tabpanel",
			id: tabsId + "asidepanel",
			"aria-labelledby": tabsId + ASIDE_TAB,
			className: cn(panes_module_default.page, !open && panes_module_default.hidden),
			children: aside
		}),
		/* @__PURE__ */ jsx("div", {
			className: cn(panes_module_default.main, panes_module_default.scroll, open && panes_module_default.hidden),
			...narrow ? {
				role: "tabpanel",
				id: tabsId + "mainpanel",
				"aria-labelledby": tabsId + MAIN_TAB
			} : {},
			children
		})
	] });
	return /* @__PURE__ */ jsx("div", {
		ref: setRef,
		"data-slot": "panes",
		"data-narrow": narrow || void 0,
		className: cn(panes_module_default.root, className),
		...props,
		children: /* @__PURE__ */ jsxs("div", {
			className: panes_module_default.columns,
			children: [narrow ? identityBlock : /* @__PURE__ */ jsxs("aside", {
				"data-slot": "panes-aside",
				"aria-label": asideLabel,
				className: cn(panes_module_default.aside, asideClassName),
				children: [identityBlock, aside]
			}), /* @__PURE__ */ jsx("div", {
				"data-slot": "panes-main",
				className: panes_module_default.main,
				children: main
			})]
		})
	});
}
Panes.displayName = "Panes";
export { Container, DetailLayout, FormMeasure, Grid, Inline, InlineGrow, InlineItem, Measure, PageMeasure, Panes, Stack };

//# sourceMappingURL=layout.js.map