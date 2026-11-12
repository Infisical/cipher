"use client";
import { useV4PortalContainer } from "../scope.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import { Input } from "./input.js";
import { FrameScope } from "../lib/frame-context.js";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending.js";
import { splitOverlaySections } from "../lib/overlay-sections.js";
import { useOwnedEscape } from "../lib/use-owned-escape.js";
import { cn } from "../lib/utils.js";
import overlay_module_default from "./overlay.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertDialog as AlertDialog$1 } from "radix-ui";
// src/ui/alert-dialog.tsx
var ConfirmContext = React.createContext({ ready: true });
var PendingClaimContext = React.createContext(() => {});
var ToneContext = React.createContext({ claimMedia: () => {} });
function AlertDialog({ ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Root, {
		"data-slot": "alert-dialog",
		...props
	});
}
function AlertDialogTrigger({ ref, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Trigger, {
		ref,
		"data-slot": "alert-dialog-trigger",
		...props
	});
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";
function AlertDialogPortal({ children, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Portal, {
		container: useV4PortalContainer(),
		"data-slot": "alert-dialog-portal",
		...props,
		children: /* @__PURE__ */ jsx(FrameScope, {
			framed: false,
			children
		})
	});
}
function AlertDialogOverlay({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Overlay, {
		ref,
		"data-slot": "alert-dialog-overlay",
		className: cn("z-50", overlay_module_default.scrim, className),
		...props
	});
}
AlertDialogOverlay.displayName = "AlertDialogOverlay";
function AlertDialogContent({ className, size = "default", tone, icon, confirmText, pending = false, onEscapeKeyDown, children, ref, ...props }) {
	const escape = useOwnedEscape(ref, onEscapeKeyDown);
	const [loadingActions, setLoadingActions] = React.useState(0);
	const claimPending = React.useCallback((delta) => setLoadingActions((count) => count + delta), []);
	const busy = pending || loadingActions > 0;
	const guard = useDismissGuard(busy, { onEscapeKeyDown: escape.onEscapeKeyDown });
	const [typed, setTyped] = React.useState("");
	const [hasMedia, setHasMedia] = React.useState(false);
	const toneValue = React.useMemo(() => ({
		tone,
		claimMedia: setHasMedia
	}), [tone]);
	const fieldId = React.useId();
	const field = confirmText !== void 0 && /* @__PURE__ */ jsxs("div", {
		"data-slot": "alert-dialog-confirm",
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ jsxs("label", {
			htmlFor: fieldId,
			className: "text-sm",
			children: [
				"Type ",
				/* @__PURE__ */ jsx("code", {
					className: "font-mono",
					children: confirmText
				}),
				" to confirm"
			]
		}), /* @__PURE__ */ jsx(Input, {
			id: fieldId,
			mono: true,
			autoFocus: true,
			autoComplete: "off",
			spellCheck: false,
			value: typed,
			onChange: (event) => setTyped(event.target.value),
			onKeyDown: (event) => {
				if (event.key !== "Enter" || event.nativeEvent.isComposing || event.keyCode === 229) return;
				event.preventDefault();
				if (busy || typed !== confirmText) return;
				event.currentTarget.closest("[data-slot=alert-dialog-content]")?.querySelector("[data-slot=alert-dialog-action]")?.click();
			}
		})]
	}, "confirm-field");
	const parts = React.Children.toArray(children);
	const footerAt = parts.findIndex((child) => React.isValidElement(child) && child.type === AlertDialogFooter);
	if (field) parts.splice(footerAt < 0 ? parts.length : footerAt, 0, field);
	const sections = splitOverlaySections([!hasMedia && (icon || tone === "danger") && /* @__PURE__ */ jsx(AlertDialogMedia, {
		"data-auto": "",
		children: /* @__PURE__ */ jsx(Icon, {
			name: icon ?? "trash",
			size: 20
		})
	}, "auto-media"), ...parts], {
		header: AlertDialogHeader,
		footer: AlertDialogFooter
	});
	return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [/* @__PURE__ */ jsx(AlertDialogOverlay, {}), /* @__PURE__ */ jsx(AlertDialog$1.Content, {
		ref: escape.ref,
		"data-slot": "alert-dialog-content",
		"data-scroll-fade": sections ? void 0 : "y",
		"data-sections": sections ? "" : void 0,
		"data-size": size,
		"data-tone": tone,
		"aria-busy": busy || void 0,
		className: cn("group/alert-dialog-content z-50 data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm", overlay_module_default.pop, overlay_module_default.dialog, className),
		...props,
		onOpenAutoFocus: (event) => {
			props.onOpenAutoFocus?.(event);
			if (confirmText === void 0 || event.defaultPrevented) return;
			setTyped("");
			event.preventDefault();
			document.getElementById(fieldId)?.focus();
		},
		onEscapeKeyDown: guard.onEscapeKeyDown,
		children: /* @__PURE__ */ jsx(OverlayPendingContext, {
			value: busy,
			children: /* @__PURE__ */ jsx(PendingClaimContext, {
				value: claimPending,
				children: /* @__PURE__ */ jsx(ConfirmContext, {
					value: { ready: confirmText === void 0 || typed === confirmText },
					children: /* @__PURE__ */ jsx(ToneContext, {
						value: toneValue,
						children: sections ? /* @__PURE__ */ jsxs(Fragment, { children: [sections.scroll.length > 0 && /* @__PURE__ */ jsx("div", {
							"data-slot": "alert-dialog-scroll",
							"data-scroll-fade": "y",
							"data-before-footer": sections.footer.length > 0 || void 0,
							children: sections.scroll
						}), sections.footer] }) : /* @__PURE__ */ jsxs(Fragment, { children: [!hasMedia && (icon || tone === "danger") && /* @__PURE__ */ jsx(AlertDialogMedia, {
							"data-auto": "",
							children: /* @__PURE__ */ jsx(Icon, {
								name: icon ?? "trash",
								size: 20
							})
						}), parts] })
					})
				})
			})
		})
	})] });
}
AlertDialogContent.displayName = "AlertDialogContent";
function AlertDialogHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-dialog-header",
		className: cn("flex flex-col gap-1.5 text-left", className),
		...props
	});
}
AlertDialogHeader.displayName = "AlertDialogHeader";
function AlertDialogFooter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-dialog-footer",
		className: cn("flex flex-col-reverse group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end", className),
		...props
	});
}
AlertDialogFooter.displayName = "AlertDialogFooter";
function AlertDialogMedia({ className, ref, ...props }) {
	const { tone, claimMedia } = React.useContext(ToneContext);
	const auto = props["data-auto"] !== void 0;
	React.useLayoutEffect(() => {
		if (auto) return void 0;
		claimMedia(true);
		return () => claimMedia(false);
	}, [auto, claimMedia]);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-dialog-media",
		"data-tone": tone ?? "neutral",
		className: cn("inline-flex size-10 shrink-0 items-center justify-center *:[svg:not([class*='size-'])]:size-5", className),
		...props
	});
}
AlertDialogMedia.displayName = "AlertDialogMedia";
function AlertDialogTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Title, {
		ref,
		"data-slot": "alert-dialog-title",
		className: cn("", className),
		...props
	});
}
AlertDialogTitle.displayName = "AlertDialogTitle";
function AlertDialogDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(AlertDialog$1.Description, {
		ref,
		"data-slot": "alert-dialog-description",
		className: cn("text-muted-foreground text-balance md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground", className),
		...props
	});
}
AlertDialogDescription.displayName = "AlertDialogDescription";
function AlertDialogAction({ className, variant = "default", size = "default", asChild, disabled, loading, onClick, ref, ...props }) {
	const { ready } = React.useContext(ConfirmContext);
	const claimPending = React.useContext(PendingClaimContext);
	React.useLayoutEffect(() => {
		if (!loading) return void 0;
		claimPending(1);
		return () => claimPending(-1);
	}, [loading, claimPending]);
	const handleClick = loading === void 0 ? onClick : (event) => {
		event.preventDefault();
		if (!loading) onClick?.(event);
	};
	if (asChild) {
		const { onClickCapture, onPointerDownCapture, onKeyDownCapture, ...rest } = props;
		const block = (event) => {
			event.preventDefault();
			event.stopPropagation();
		};
		return /* @__PURE__ */ jsx(AlertDialog$1.Action, {
			ref,
			asChild: true,
			"data-slot": "alert-dialog-action",
			className,
			disabled: disabled || !ready,
			...rest,
			"aria-busy": loading || rest["aria-busy"] || void 0,
			"aria-disabled": loading || rest["aria-disabled"] || void 0,
			onClick: handleClick,
			onClickCapture: (event) => loading ? block(event) : onClickCapture?.(event),
			onPointerDownCapture: (event) => loading ? block(event) : onPointerDownCapture?.(event),
			onKeyDownCapture: (event) => loading && (event.key === "Enter" || event.key === " ") ? block(event) : onKeyDownCapture?.(event)
		});
	}
	return /* @__PURE__ */ jsx(Button, {
		variant,
		size,
		disabled: disabled || !ready,
		loading,
		asChild: true,
		children: /* @__PURE__ */ jsx(AlertDialog$1.Action, {
			ref,
			"data-slot": "alert-dialog-action",
			className: cn(className),
			onClick: handleClick,
			...props
		})
	});
}
AlertDialogAction.displayName = "AlertDialogAction";
function AlertDialogCancel({ className, variant = "outline", size = "default", asChild, disabled, ref, ...props }) {
	const pending = useOverlayPending();
	if (asChild) return /* @__PURE__ */ jsx(AlertDialog$1.Cancel, {
		ref,
		asChild: true,
		"data-slot": "alert-dialog-cancel",
		className,
		disabled: disabled || pending,
		...props
	});
	return /* @__PURE__ */ jsx(Button, {
		variant,
		size,
		disabled: disabled || pending,
		asChild: true,
		children: /* @__PURE__ */ jsx(AlertDialog$1.Cancel, {
			ref,
			"data-slot": "alert-dialog-cancel",
			className: cn(className),
			...props
		})
	});
}
AlertDialogCancel.displayName = "AlertDialogCancel";
function DiscardChangesAlertDialog({ open, onOpenChange, onDiscard, title = "Discard changes?", description = "Your changes will be lost." }) {
	return /* @__PURE__ */ jsx(AlertDialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(AlertDialogContent, {
			tone: "danger",
			icon: "alert",
			children: [/* @__PURE__ */ jsxs(AlertDialogHeader, { children: [/* @__PURE__ */ jsx(AlertDialogTitle, { children: title }), /* @__PURE__ */ jsx(AlertDialogDescription, { children: description })] }), /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [/* @__PURE__ */ jsx(AlertDialogCancel, { children: "Keep editing" }), /* @__PURE__ */ jsx(AlertDialogAction, {
				variant: "destructive",
				onClick: onDiscard,
				children: "Discard"
			})] })]
		})
	});
}
DiscardChangesAlertDialog.displayName = "DiscardChangesAlertDialog";
export { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger, DiscardChangesAlertDialog };

//# sourceMappingURL=alert-dialog.js.map