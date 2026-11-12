import { useV4PortalContainer } from "../scope.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { FrameScope } from "../lib/frame-context.js";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending.js";
import { renderInForm, splitOverlaySections } from "../lib/overlay-sections.js";
import { useOwnedEscape } from "../lib/use-owned-escape.js";
import { cn } from "../lib/utils.js";
import overlay_module_default from "./overlay.module.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Dialog } from "radix-ui";
// src/ui/sheet.tsx
function Sheet({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Root, {
		"data-slot": "sheet",
		...props
	});
}
function SheetTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Trigger, {
		ref,
		"data-slot": "sheet-trigger",
		...props
	});
}
SheetTrigger.displayName = "SheetTrigger";
function SheetClose({ ref, disabled, ...props }) {
	const pending = useOverlayPending();
	return /* @__PURE__ */ jsx(Dialog.Close, {
		ref,
		"data-slot": "sheet-close",
		disabled: disabled || pending,
		...props
	});
}
SheetClose.displayName = "SheetClose";
function SheetPortal({ children, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Portal, {
		container: useV4PortalContainer(),
		"data-slot": "sheet-portal",
		...props,
		children: /* @__PURE__ */ jsx(FrameScope, {
			framed: false,
			children
		})
	});
}
function SheetOverlay({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Overlay, {
		ref,
		"data-slot": "sheet-overlay",
		className: cn("z-50", overlay_module_default.scrim, overlay_module_default.scrimSlow, className),
		...props
	});
}
SheetOverlay.displayName = "SheetOverlay";
var SheetLayout = ({ head, scroll, footer }) => /* @__PURE__ */ jsxs(Fragment, { children: [
	head && /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-head",
		children: head
	}),
	scroll && /* @__PURE__ */ jsx("div", {
		"data-slot": "sheet-scroll",
		"data-scroll-fade": "y",
		"data-before-footer": Boolean(footer) || void 0,
		children: scroll
	}),
	footer
] });
function SheetContent({ className, children, side = "right", size = "sm", showCloseButton = true, pending = false, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, ref, ...props }) {
	const escape = useOwnedEscape(ref, onEscapeKeyDown);
	const guard = useDismissGuard(pending, {
		onEscapeKeyDown: escape.onEscapeKeyDown,
		onPointerDownOutside,
		onInteractOutside
	});
	const sections = splitOverlaySections(children, {
		header: SheetHeader,
		subheader: SheetSubheader,
		body: SheetBody,
		footer: SheetFooter
	}, {
		pinHeader: true,
		lookThroughForm: true
	});
	return /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsx(Dialog.Content, {
		ref: escape.ref,
		"data-slot": "sheet-content",
		"data-has-close": showCloseButton || void 0,
		"data-scroll-fade": sections ? void 0 : "y",
		"data-sections": sections ? "" : void 0,
		"data-side": side,
		"data-size": size,
		className: cn("fixed z-50 flex flex-col gap-4 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto", overlay_module_default.pop, overlay_module_default.sheet, className),
		"aria-busy": pending || void 0,
		...props,
		...guard,
		children: /* @__PURE__ */ jsxs(OverlayPendingContext, {
			value: pending,
			children: [sections ? renderInForm(sections.form, "sheet-form", /* @__PURE__ */ jsx(SheetLayout, {
				head: sections.pinned.length > 0 && sections.pinned,
				scroll: sections.scroll.length > 0 && sections.scroll,
				footer: sections.footer.length > 0 && sections.footer
			})) : children, showCloseButton && /* @__PURE__ */ jsx(Dialog.Close, {
				"data-slot": "sheet-close",
				asChild: true,
				children: /* @__PURE__ */ jsxs(Button, {
					variant: "ghost",
					className: overlay_module_default.close,
					size: "icon-sm",
					disabled: pending,
					children: [/* @__PURE__ */ jsx(Icon, { name: "x" }), /* @__PURE__ */ jsx("span", {
						className: "sr-only",
						children: "Close"
					})]
				})
			})]
		})
	})] });
}
SheetContent.displayName = "SheetContent";
/**
* The pinned layout for content that SheetContent cannot see: a view component that renders its own
* header and footer, or a header wrapped in another component. header and footer are pinned and
* children scroll between them, so pinning never depends on what the direct children are.
*/
function SheetSections({ header, footer, children, className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-sections",
		"data-sections": "",
		className: cn(className),
		...props,
		children: /* @__PURE__ */ jsx(SheetLayout, {
			head: header,
			scroll: children,
			footer: footer && /* @__PURE__ */ jsx("div", {
				"data-slot": "sheet-foot",
				children: footer
			})
		})
	});
}
SheetSections.displayName = "SheetSections";
function SheetHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-header",
		className: cn("flex flex-col gap-0.5 p-4", className),
		...props
	});
}
SheetHeader.displayName = "SheetHeader";
function SheetSubheader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-subheader",
		className: cn(className),
		...props
	});
}
SheetSubheader.displayName = "SheetSubheader";
function SheetBody({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-body",
		className: cn(className),
		...props
	});
}
SheetBody.displayName = "SheetBody";
function SheetFooter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "sheet-footer",
		className: cn("mt-auto flex flex-col gap-2 p-4", className),
		...props
	});
}
SheetFooter.displayName = "SheetFooter";
function SheetTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Title, {
		ref,
		"data-slot": "sheet-title",
		className: cn("text-foreground", className),
		...props
	});
}
SheetTitle.displayName = "SheetTitle";
function SheetDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog.Description, {
		ref,
		"data-slot": "sheet-description",
		className: cn("text-muted-foreground", className),
		...props
	});
}
SheetDescription.displayName = "SheetDescription";
export { Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetSections, SheetSubheader, SheetTitle, SheetTrigger };

//# sourceMappingURL=sheet.js.map