import { cn } from "../lib/utils.js";
import route_progress_module_default from "./route-progress.module.js";
import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/ui/route-progress.tsx
/** A thin bar along the top of the viewport while the router resolves a navigation. */
function RouteProgress({ pending, className }) {
	const [run, setRun] = React.useState(0);
	React.useEffect(() => {
		if (pending) setRun((current) => current + 1);
	}, [pending]);
	let state = "idle";
	if (pending) state = "loading";
	else if (run > 0) state = "done";
	return /* @__PURE__ */ jsx("div", {
		"aria-hidden": "true",
		"data-slot": "route-progress",
		"data-state": state,
		className: cn(route_progress_module_default.progress, className),
		children: /* @__PURE__ */ jsx("div", { className: route_progress_module_default.bar }, run)
	});
}
RouteProgress.displayName = "RouteProgress";
export { RouteProgress };

//# sourceMappingURL=route-progress.js.map