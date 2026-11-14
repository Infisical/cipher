import { cn } from "../lib/utils.js";
import { Spinner } from "./spinner.js";
import loader_module_default from "./loader.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/loader.tsx
function Loader({ loading = true, label, description, size = "base", delay = 300, children, className, ref, ...props }) {
	if (!loading) return children;
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "loader",
		"data-size": size,
		"aria-busy": "true",
		className: cn(loader_module_default.loader, className),
		...props,
		children: /* @__PURE__ */ jsx(Spinner, {
			size,
			label,
			description,
			delay
		})
	});
}
Loader.displayName = "Loader";
export { Loader };

//# sourceMappingURL=loader.js.map