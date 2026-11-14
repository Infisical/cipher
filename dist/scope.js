import { usePresenceCount } from "./lib/presence-count.js";
import { watchScrollEdges } from "./lib/scroll-edges.js";
import { defaultTheme, themeScheme, toTheme } from "./lib/theme-registry.js";
import { cn } from "./lib/utils.js";
import * as React from "react";
import { createPortal } from "react-dom";
import { MotionConfig } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/scope.tsx
var PortalContainerContext = React.createContext(void 0);
var ThemeContext = React.createContext(void 0);
var CollisionBoundaryContext = React.createContext(void 0);
var ToastLayerContext = React.createContext(null);
var ActionBarReserveContext = React.createContext(null);
var usePortalContainer = () => React.useContext(PortalContainerContext);
var useCollisionBoundary = () => React.useContext(CollisionBoundaryContext);
var useTheme = () => React.useContext(ThemeContext);
var useScheme = () => {
	const theme = useTheme();
	return theme ? themeScheme(theme) : void 0;
};
var useToastLayer = () => React.useContext(ToastLayerContext);
/** A shown FloatingActionBar reports here, so every node of the scope, toast layer included, lifts its toasts clear of the bar. */
var useActionBarReport = () => React.useContext(ActionBarReserveContext);
function inheritedTheme(node, fallback) {
	let ancestor = node.parentElement;
	while (ancestor) {
		const value = toTheme(ancestor.getAttribute("data-theme"));
		if (value) return value;
		ancestor = ancestor.parentElement;
	}
	return fallback ?? defaultTheme.light;
}
function CipherScope({ children, className, theme, portalContainer, ref: forwardedRef, ...props }) {
	const parentTheme = useTheme();
	const [wrapper, setWrapper] = React.useState(null);
	const [container, setContainer] = React.useState(null);
	const [toastLayer, setToastLayer] = React.useState(null);
	const [inherited, setInherited] = React.useState();
	const [actionBarReserve, reportActionBar] = usePresenceCount();
	const reserve = actionBarReserve || void 0;
	const resolvedTheme = toTheme(theme) ?? inherited ?? parentTheme ?? defaultTheme.light;
	const scheme = themeScheme(resolvedTheme);
	const assignWrapper = React.useCallback((node) => {
		setWrapper(node);
		if (typeof forwardedRef === "function") forwardedRef(node);
		else {
			const targetRef = forwardedRef;
			if (targetRef) targetRef.current = node;
		}
	}, [forwardedRef]);
	React.useEffect(() => watchScrollEdges(), []);
	const appliedTheme = React.useRef(resolvedTheme);
	React.useLayoutEffect(() => {
		if (appliedTheme.current === resolvedTheme) return void 0;
		appliedTheme.current = resolvedTheme;
		const scopes = [
			wrapper,
			container,
			toastLayer
		].filter((node) => Boolean(node));
		scopes.forEach((node) => node.setAttribute("data-theme-switching", ""));
		scopes.forEach((node) => getComputedStyle(node).transitionProperty);
		const frame = requestAnimationFrame(() => scopes.forEach((node) => node.removeAttribute("data-theme-switching")));
		return () => {
			cancelAnimationFrame(frame);
			scopes.forEach((node) => node.removeAttribute("data-theme-switching"));
		};
	}, [
		resolvedTheme,
		wrapper,
		container,
		toastLayer
	]);
	React.useLayoutEffect(() => {
		if (!wrapper || theme !== void 0) return void 0;
		const update = () => setInherited(inheritedTheme(wrapper, parentTheme));
		update();
		const observer = new MutationObserver(update);
		let ancestor = wrapper.parentElement;
		while (ancestor) {
			observer.observe(ancestor, {
				attributes: true,
				attributeFilter: ["data-theme"]
			});
			ancestor = ancestor.parentElement;
		}
		return () => observer.disconnect();
	}, [
		wrapper,
		theme,
		parentTheme
	]);
	return /* @__PURE__ */ jsx(MotionConfig, {
		reducedMotion: "user",
		children: /* @__PURE__ */ jsx(ThemeContext, {
			value: resolvedTheme,
			children: /* @__PURE__ */ jsx(PortalContainerContext, {
				value: container,
				children: /* @__PURE__ */ jsx(ToastLayerContext, {
					value: toastLayer,
					children: /* @__PURE__ */ jsx(ActionBarReserveContext, {
						value: reportActionBar,
						children: /* @__PURE__ */ jsxs(CollisionBoundaryContext, {
							value: portalContainer ?? void 0,
							children: [/* @__PURE__ */ jsx("div", {
								...props,
								ref: assignWrapper,
								className: cn("cipher", className),
								"data-theme": resolvedTheme,
								"data-scheme": scheme,
								"data-action-bar-reserve": reserve,
								children
							}), portalContainer !== null && createPortal(/* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
								ref: setContainer,
								className: "cipher",
								"data-theme": resolvedTheme,
								"data-scheme": scheme,
								"data-action-bar-reserve": reserve
							}), /* @__PURE__ */ jsx("div", {
								ref: setToastLayer,
								className: "cipher",
								"data-theme": resolvedTheme,
								"data-scheme": scheme,
								"data-action-bar-reserve": reserve,
								"data-slot": "cipher-toast-layer"
							})] }), portalContainer ?? document.body)]
						})
					})
				})
			})
		})
	});
}
CipherScope.displayName = "CipherScope";
export { CipherScope, useActionBarReport, useCollisionBoundary, usePortalContainer, useScheme, useTheme, useToastLayer };

//# sourceMappingURL=scope.js.map