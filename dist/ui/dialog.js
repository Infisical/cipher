import { usePortalContainer } from "../scope.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { FrameScope } from "../lib/frame-context.js";
import { focusFirstControl } from "../lib/initial-focus.js";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending.js";
import { renderInForm, splitOverlaySections } from "../lib/overlay-sections.js";
import { useOwnedEscape } from "../lib/use-owned-escape.js";
import { cn } from "../lib/utils.js";
import overlay_module_default from "./overlay.module.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Dialog as Dialog$1 } from "radix-ui";
// src/ui/dialog.tsx
function Dialog({ ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Root, {
		"data-slot": "dialog",
		...props
	});
}
function DialogTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Trigger, {
		ref,
		"data-slot": "dialog-trigger",
		...props
	});
}
DialogTrigger.displayName = "DialogTrigger";
function DialogPortal({ children, ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Portal, {
		container: usePortalContainer(),
		"data-slot": "dialog-portal",
		...props,
		children: /* @__PURE__ */ jsx(FrameScope, {
			framed: false,
			children
		})
	});
}
function DialogClose({ ref, disabled, ...props }) {
	const pending = useOverlayPending();
	return /* @__PURE__ */ jsx(Dialog$1.Close, {
		ref,
		"data-slot": "dialog-close",
		disabled: disabled || pending,
		...props
	});
}
DialogClose.displayName = "DialogClose";
function DialogOverlay({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Overlay, {
		ref,
		"data-slot": "dialog-overlay",
		className: cn("isolate z-50", overlay_module_default.scrim, className),
		...props
	});
}
DialogOverlay.displayName = "DialogOverlay";
function DialogContent({ className, children, showCloseButton = true, pending = false, onEscapeKeyDown, onPointerDownOutside, onInteractOutside, onOpenAutoFocus, ref, ...props }) {
	const escape = useOwnedEscape(ref, onEscapeKeyDown);
	const guard = useDismissGuard(pending, {
		onEscapeKeyDown: escape.onEscapeKeyDown,
		onPointerDownOutside,
		onInteractOutside
	});
	const sections = splitOverlaySections(children, {
		header: DialogHeader,
		subheader: DialogSubheader,
		footer: DialogFooter
	}, {
		pinHeader: true,
		lookThroughForm: true
	});
	return /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsx(Dialog$1.Content, {
		ref: escape.ref,
		"data-slot": "dialog-content",
		"data-has-close": showCloseButton || void 0,
		"data-scroll-fade": sections ? void 0 : "y",
		"data-sections": sections ? "" : void 0,
		"aria-busy": pending || void 0,
		className: cn("z-50", overlay_module_default.pop, overlay_module_default.dialog, className),
		onOpenAutoFocus: (event) => {
			onOpenAutoFocus?.(event);
			focusFirstControl(event);
		},
		...props,
		...guard,
		children: /* @__PURE__ */ jsxs(OverlayPendingContext, {
			value: pending,
			children: [sections ? renderInForm(sections.form, "dialog-form", /* @__PURE__ */ jsxs(Fragment, { children: [
				sections.pinned.length > 0 && /* @__PURE__ */ jsx("div", {
					"data-slot": "dialog-head",
					children: sections.pinned
				}),
				sections.scroll.length > 0 && /* @__PURE__ */ jsx("div", {
					"data-slot": "dialog-scroll",
					"data-scroll-fade": "y",
					"data-before-footer": sections.footer.length > 0 || void 0,
					children: sections.scroll
				}),
				sections.footer
			] })) : children, showCloseButton && /* @__PURE__ */ jsx(Dialog$1.Close, {
				"data-slot": "dialog-close",
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
DialogContent.displayName = "DialogContent";
function DialogHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "dialog-header",
		className: cn("flex flex-col gap-2", className),
		...props
	});
}
DialogHeader.displayName = "DialogHeader";
function DialogSubheader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "dialog-subheader",
		className: cn(className),
		...props
	});
}
DialogSubheader.displayName = "DialogSubheader";
function DialogFooter({ className, showCloseButton = false, children, ref, ...props }) {
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "dialog-footer",
		className: cn("flex flex-col-reverse sm:flex-row sm:justify-end", className),
		...props,
		children: [children, showCloseButton && /* @__PURE__ */ jsx(DialogClose, {
			asChild: true,
			children: /* @__PURE__ */ jsx(Button, {
				variant: "outline",
				children: "Close"
			})
		})]
	});
}
DialogFooter.displayName = "DialogFooter";
function DialogTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Title, {
		ref,
		"data-slot": "dialog-title",
		className: cn("", className),
		...props
	});
}
DialogTitle.displayName = "DialogTitle";
function DialogDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Dialog$1.Description, {
		ref,
		"data-slot": "dialog-description",
		className: cn("text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className),
		...props
	});
}
DialogDescription.displayName = "DialogDescription";
export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSubheader, DialogTitle, DialogTrigger };

//# sourceMappingURL=dialog.js.map