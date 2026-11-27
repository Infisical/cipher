import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/action-bar-host.tsx
var ActionBarHostContext = React.createContext(void 0);
/** The scroller a FloatingActionBar under a modal overlay portals into, or undefined outside one. Null while the scroller mounts. */
var useActionBarHost = () => React.useContext(ActionBarHostContext);
/** Provides an overlay scroller as the action bar host, so the bar stays inside the overlay's focus trap and dismiss layer instead of portalling under its scrim. */
function ActionBarHost({ host, children }) {
	return /* @__PURE__ */ jsx(ActionBarHostContext, {
		value: host,
		children
	});
}
/** An overlay scroller that hosts a FloatingActionBar rendered inside it. */
function ActionBarScroller({ children, ref, ...props }) {
	const [host, setHost] = React.useState(null);
	const setRefs = React.useCallback((node) => {
		setHost(node);
		if (typeof ref === "function") return ref(node);
		if (ref) ref.current = node;
	}, [ref]);
	return /* @__PURE__ */ jsx("div", {
		...props,
		ref: setRefs,
		children: /* @__PURE__ */ jsx(ActionBarHost, {
			host,
			children
		})
	});
}
export { ActionBarHost, ActionBarScroller, useActionBarHost };

//# sourceMappingURL=action-bar-host.js.map