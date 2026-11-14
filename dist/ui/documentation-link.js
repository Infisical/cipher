import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Tooltip } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import documentation_link_module_default from "./documentation-link.module.js";
import "react";
import { jsx } from "react/jsx-runtime";
// src/ui/documentation-link.tsx
function DocumentationLink({ href, subject, size, className, ref }) {
	return /* @__PURE__ */ jsx(Tooltip, {
		content: "Documentation",
		children: /* @__PURE__ */ jsx("a", {
			ref,
			href,
			target: "_blank",
			rel: "noopener noreferrer",
			"aria-label": `Documentation for ${subject} (opens in a new tab)`,
			"data-slot": "documentation-link",
			"data-size": size,
			className: cn(controls_module_default.focusOutlineInset, documentation_link_module_default.link, className),
			children: /* @__PURE__ */ jsx(Icon, { name: "external" })
		})
	});
}
DocumentationLink.displayName = "DocumentationLink";
export { DocumentationLink };

//# sourceMappingURL=documentation-link.js.map