import { readV4BootTheme } from "../lib/boot-theme.js";
import { toV4Theme, v4ThemeScheme } from "../lib/theme-registry.js";
import { cn } from "../lib/utils.js";
import { Loader } from "./loader.js";
/* empty css    */
import boot_loader_module_default from "./boot-loader.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/boot-loader.tsx
/** The page loader for app and session boot, themed from storage so it renders before V4Scope. */
function BootLoader({ label, description, theme, fill = "viewport", delay, className, ref, ...props }) {
	const resolved = toV4Theme(theme) ?? readV4BootTheme();
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "boot-loader",
		"data-fill": fill,
		"data-theme": resolved,
		"data-scheme": v4ThemeScheme(resolved),
		className: cn("v4", boot_loader_module_default.boot, className),
		...props,
		children: /* @__PURE__ */ jsx(Loader, {
			size: "page",
			label,
			description,
			delay
		})
	});
}
BootLoader.displayName = "BootLoader";
export { BootLoader };

//# sourceMappingURL=boot-loader.js.map