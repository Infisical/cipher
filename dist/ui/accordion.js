import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Accordion as Accordion$1 } from "radix-ui";
// src/ui/accordion.tsx
function Accordion({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Accordion$1.Root, {
		ref,
		"data-slot": "accordion",
		className: cn("flex w-full flex-col", className),
		...props
	});
}
Accordion.displayName = "Accordion";
function AccordionItem({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Accordion$1.Item, {
		ref,
		"data-slot": "accordion-item",
		className: cn("border-[color:var(--v4-line-soft)] not-last:border-b", className),
		...props
	});
}
AccordionItem.displayName = "AccordionItem";
function AccordionTrigger({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx(Accordion$1.Header, {
		className: "flex",
		children: /* @__PURE__ */ jsxs(Accordion$1.Trigger, {
			ref,
			"data-slot": "accordion-trigger",
			className: cn(controls_module_default.label, "group/accordion-trigger **:data-[slot=accordion-trigger-icon]:text-muted-foreground relative flex flex-1 items-start justify-between gap-(--v4-space-8) rounded-lg border border-transparent py-2.5 text-left transition-colors outline-none hover:[&>[data-slot=accordion-trigger-text]]:underline focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-[color:var(--v4-focus-ring)] focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4", className),
			...props,
			children: [
				React.Children.map(children, (child) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ jsx("span", {
					"data-slot": "accordion-trigger-text",
					children: child
				}) : child),
				/* @__PURE__ */ jsx(Icon, {
					name: "chev-down",
					"data-slot": "accordion-trigger-icon",
					className: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
				}),
				/* @__PURE__ */ jsx(Icon, {
					name: "chev-down",
					style: { rotate: "180deg" },
					"data-slot": "accordion-trigger-icon",
					className: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
				})
			]
		})
	});
}
AccordionTrigger.displayName = "AccordionTrigger";
function AccordionContent({ className, children, ref, ...props }) {
	return /* @__PURE__ */ jsx(Accordion$1.Content, {
		ref,
		"data-slot": "accordion-content",
		className: cn(controls_module_default.body, "overflow-hidden duration-(--v4-duration-moderate) ease-(--v4-ease-spring) data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"),
		...props,
		children: /* @__PURE__ */ jsx("div", {
			className: cn("pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", className),
			children
		})
	});
}
AccordionContent.displayName = "AccordionContent";
export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };

//# sourceMappingURL=accordion.js.map