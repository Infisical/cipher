import { SlidingIndicator } from "../lib/sliding-indicator.js";
import { useControllableState } from "../lib/use-controllable-state.js";
import { useMeasuredIndicator } from "../lib/use-measured-indicator.js";
import { cn } from "../lib/utils.js";
import { Count } from "./badge.js";
import controls_module_default from "./controls.module.js";
import navigation_module_default from "./navigation.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Tabs as Tabs$1 } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/tabs.tsx
var UNDERLINE_RULE_SPANS = true;
var TabsWidthContext = React.createContext({
	width: "content",
	orientation: "horizontal"
});
function Tabs({ className, orientation = "horizontal", tabs, label, variant = "underline", width = "content", onChange, onValueChange, value, defaultValue, children, ref, ...props }) {
	const [selected, setSelected] = useControllableState({
		value,
		defaultValue: defaultValue ?? tabs?.find((tab) => !tab.disabled)?.value ?? "",
		onChange: (next) => {
			onValueChange?.(next);
			onChange?.(next);
		}
	});
	return /* @__PURE__ */ jsx(Tabs$1.Root, {
		ref,
		"data-slot": "tabs",
		"data-variant": variant,
		"data-width": width,
		orientation,
		value: selected,
		onValueChange: setSelected,
		className: cn(navigation_module_default.tabs, className),
		...props,
		children: /* @__PURE__ */ jsx(TabsWidthContext, {
			value: {
				width,
				orientation
			},
			children: tabs ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TabsList, {
				"aria-label": label,
				variant,
				children: tabs.map((tab) => /* @__PURE__ */ jsxs(TabsTrigger, {
					value: tab.value,
					disabled: tab.disabled,
					children: [tab.label, tab.count !== void 0 && /* @__PURE__ */ jsx(Count, {
						tone: "neutral",
						className: navigation_module_default.tabCount,
						children: tab.count
					})]
				}, tab.value))
			}), tabs.some((tab) => tab.content != null) && tabs.map((tab) => /* @__PURE__ */ jsx(TabsContent, {
				value: tab.value,
				children: tab.content
			}, tab.value))] }) : children
		})
	});
}
Tabs.displayName = "Tabs";
var tabsListVariants = cva(navigation_module_default.tabsList, {
	variants: { variant: {
		underline: navigation_module_default.tabsUnderline,
		segmented: navigation_module_default.tabsSegmented
	} },
	defaultVariants: { variant: "underline" }
});
function TabsList({ className, variant = "underline", children, onScroll, onWheel, onWheelCapture, ref, ...props }) {
	const { width, orientation } = React.useContext(TabsWidthContext);
	const list = React.useRef(null);
	const [edge, setEdge] = React.useState({
		before: false,
		after: false
	});
	const wheelCancelled = React.useRef(false);
	const attach = React.useCallback((node) => {
		list.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	const rect = React.useCallback((active, node) => {
		const vertical = node.getAttribute("data-orientation") === "vertical";
		const line = node.dataset.variant === "underline";
		return {
			x: active.offsetLeft,
			y: active.offsetTop,
			width: line && vertical ? node.clientWidth - active.offsetLeft : active.offsetWidth,
			height: line && !vertical ? node.clientHeight - active.offsetTop : active.offsetHeight
		};
	}, []);
	const onMeasure = React.useCallback((node, active, { reveal, instant }) => {
		const vertical = node.getAttribute("data-orientation") === "vertical";
		const start = vertical ? node.scrollTop : node.scrollLeft;
		const size = vertical ? node.clientHeight : node.clientWidth;
		const length = vertical ? node.scrollHeight : node.scrollWidth;
		setEdge({
			before: start > 1,
			after: start + size < length - 1
		});
		if (!active || !reveal) return;
		const offset = vertical ? active.offsetTop : active.offsetLeft;
		const extent = vertical ? active.offsetHeight : active.offsetWidth;
		const padding = 32;
		const target = offset < start + padding ? offset - padding : offset + extent > start + size - padding ? offset + extent - size + padding : start;
		const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
		node.scrollTo?.({
			[vertical ? "top" : "left"]: Math.max(0, target),
			behavior: instant || reduced ? "instant" : "smooth"
		});
	}, []);
	const { state: indicator, measure } = useMeasuredIndicator({
		listRef: list,
		activeSelector: "[role=\"tab\"][data-state=\"active\"]",
		itemSelector: "[role=\"tab\"]",
		rect,
		onMeasure,
		watch: children
	});
	React.useLayoutEffect(() => {
		const node = list.current;
		if (!node) return void 0;
		const wheel = (event) => {
			const cancelled = wheelCancelled.current || event.defaultPrevented;
			wheelCancelled.current = false;
			if (cancelled) {
				event.preventDefault();
				return;
			}
			if (node.dataset.orientation === "vertical" || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
			const next = Math.max(0, Math.min(node.scrollWidth - node.clientWidth, node.scrollLeft + event.deltaY));
			if (next !== node.scrollLeft) {
				event.preventDefault();
				node.scrollLeft = next;
			}
		};
		node.addEventListener("wheel", wheel, { passive: false });
		return () => node.removeEventListener("wheel", wheel);
	}, []);
	return /* @__PURE__ */ jsx("div", {
		className: navigation_module_default.tabsTrack,
		"data-variant": variant,
		"data-width": width,
		"data-rule-spans": variant === "underline" && orientation !== "vertical" && UNDERLINE_RULE_SPANS || void 0,
		children: /* @__PURE__ */ jsxs(Tabs$1.List, {
			ref: attach,
			"data-slot": "tabs-list",
			"data-variant": variant,
			"data-width": width,
			"data-moving": true,
			"data-before": edge.before || void 0,
			"data-after": edge.after || void 0,
			"data-scroll-fade": "x",
			className: cn(tabsListVariants({ variant }), className),
			onScroll: (event) => {
				measure();
				onScroll?.(event);
			},
			onFocusCapture: () => measure(true),
			onWheelCapture: (event) => {
				onWheelCapture?.(event);
				onWheel?.(event);
				wheelCancelled.current = event.defaultPrevented;
			},
			...props,
			children: [/* @__PURE__ */ jsx(SlidingIndicator, {
				state: indicator,
				className: cn(controls_module_default.indicator, navigation_module_default.tabIndicator)
			}), children]
		})
	});
}
TabsList.displayName = "TabsList";
function TabsTrigger({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Tabs$1.Trigger, {
		ref,
		"data-slot": "tabs-trigger",
		className: cn(controls_module_default.focusOutline, navigation_module_default.tabTrigger, className),
		...props
	});
}
TabsTrigger.displayName = "TabsTrigger";
function TabsContent({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Tabs$1.Content, {
		ref,
		"data-slot": "tabs-content",
		className: cn(navigation_module_default.tabsContent, className),
		...props
	});
}
TabsContent.displayName = "TabsContent";
export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };

//# sourceMappingURL=tabs.js.map