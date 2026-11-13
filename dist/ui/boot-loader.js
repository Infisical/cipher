import { readBootTheme } from "../lib/boot-theme.js";
import { themeScheme, toTheme } from "../lib/theme-registry.js";
import { cn } from "../lib/utils.js";
import { Loader } from "./loader.js";
/* empty css      */
import boot_loader_module_default from "./boot-loader.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/boot-loader.tsx
/** The page loader for app and session boot, themed from storage so it renders before CipherScope. */
function BootLoader({ label, description, theme, fill = "viewport", delay, storageKeys, allowPreview, className, ref, ...props }) {
	const resolved = toTheme(theme) ?? readBootTheme({
		keys: storageKeys,
		allowPreview
	});
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "boot-loader",
		"data-fill": fill,
		"data-theme": resolved,
		"data-scheme": themeScheme(resolved),
		className: cn("cipher", boot_loader_module_default.boot, className),
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