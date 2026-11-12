import { cn } from "../lib/utils.js";
import { Badge } from "./badge.js";
import { Icon } from "./icon.js";
import { Tooltip } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import documentation_link_badge_module_default from "./documentation-link-badge.module.js";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/documentation-link-badge.tsx
var label = "Documentation";
function DocumentationLinkBadge({ href, variant = "default", className }) {
	const link = {
		href,
		target: "_blank",
		rel: "noopener noreferrer"
	};
	if (variant === "minified") return /* @__PURE__ */ jsx(Tooltip, {
		content: label,
		children: /* @__PURE__ */ jsx("a", {
			...link,
			"aria-label": `${label} (opens in a new tab)`,
			"data-slot": "documentation-link-badge",
			"data-variant": "minified",
			className: cn(controls_module_default.focusOutline, documentation_link_badge_module_default.minified, className),
			children: /* @__PURE__ */ jsx(Icon, { name: "external" })
		})
	});
	return /* @__PURE__ */ jsx(Tooltip, {
		content: "Opens in a new tab",
		children: /* @__PURE__ */ jsx(Badge, {
			tone: "info",
			asChild: true,
			className: cn(documentation_link_badge_module_default.badge, className),
			children: /* @__PURE__ */ jsxs("a", {
				...link,
				"data-slot": "documentation-link-badge",
				"data-variant": "default",
				children: [
					label,
					/* @__PURE__ */ jsx(Icon, { name: "external" }),
					/* @__PURE__ */ jsx("span", {
						className: documentation_link_badge_module_default.sr,
						children: " (opens in a new tab)"
					})
				]
			})
		})
	});
}
export { DocumentationLinkBadge };

//# sourceMappingURL=documentation-link-badge.js.map