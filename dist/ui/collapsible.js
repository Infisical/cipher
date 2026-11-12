"use client";
import "react";
import { jsx } from "react/jsx-runtime";
import { Collapsible as Collapsible$1 } from "radix-ui";
// src/ui/collapsible.tsx
function Collapsible({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Collapsible$1.Root, {
		ref,
		"data-slot": "collapsible",
		...props
	});
}
Collapsible.displayName = "Collapsible";
function CollapsibleTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Collapsible$1.CollapsibleTrigger, {
		ref,
		"data-slot": "collapsible-trigger",
		...props
	});
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";
function CollapsibleContent({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Collapsible$1.CollapsibleContent, {
		ref,
		"data-slot": "collapsible-content",
		...props
	});
}
CollapsibleContent.displayName = "CollapsibleContent";
export { Collapsible, CollapsibleContent, CollapsibleTrigger };

//# sourceMappingURL=collapsible.js.map