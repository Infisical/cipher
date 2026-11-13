import { useDescendantFlags } from "../lib/descendant-flags.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import helpers_module_default from "./helpers.module.js";
import "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/alert.tsx
var alertFlags = {
	"data-has-icon": ":scope > svg",
	"data-has-title": `:scope > .${helpers_module_default.alertTitle}`,
	"data-has-action": ":scope > [data-slot=\"alert-action\"]"
};
var alertWatch = { subtree: false };
function Alert({ className, variant, tone = variant === "destructive" ? "bad" : "neutral", title, actions, onDismiss, children, ref, ...props }) {
	const alertRef = useDescendantFlags(alertFlags, alertWatch, ref);
	return /* @__PURE__ */ jsxs("div", {
		ref: alertRef,
		"data-slot": "alert",
		"data-variant": variant ?? "default",
		role: tone === "bad" ? "alert" : "status",
		"data-tone": tone,
		className: cn(helpers_module_default.alert, className),
		...props,
		children: [title ? /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Icon, { name: tone === "bad" ? "alert-c" : tone === "ok" ? "check-c" : tone === "warn" ? "alert" : "info" }),
			/* @__PURE__ */ jsx(AlertTitle, { children: title }),
			/* @__PURE__ */ jsxs(AlertDescription, { children: [children, actions && /* @__PURE__ */ jsx("div", {
				className: helpers_module_default.alertActions,
				children: actions
			})] })
		] }) : children, onDismiss && /* @__PURE__ */ jsx(AlertAction, { children: /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-xs",
			"aria-label": "Dismiss alert",
			onClick: onDismiss,
			children: /* @__PURE__ */ jsx(Icon, { name: "x" })
		}) })]
	});
}
Alert.displayName = "Alert";
function AlertTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-title",
		className: cn(helpers_module_default.alertTitle, "[&_a:not([data-slot=button])]:underline [&_a:not([data-slot=button])]:underline-offset-3 [&_a:not([data-slot=button])]:hover:text-foreground", className),
		...props
	});
}
AlertTitle.displayName = "AlertTitle";
function AlertDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-description",
		className: cn(helpers_module_default.alertDescription, "text-muted-foreground text-balance md:text-pretty [&_p:not(:last-child)]:mb-4", className),
		...props
	});
}
AlertDescription.displayName = "AlertDescription";
function AlertAction({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "alert-action",
		className: cn(helpers_module_default.alertAction, className),
		...props
	});
}
AlertAction.displayName = "AlertAction";
var Banner = ({ icon = "lock", children, action, onDismiss, className }) => /* @__PURE__ */ jsxs("div", {
	"data-slot": "banner",
	role: "status",
	className: cn(helpers_module_default.banner, className),
	children: [
		/* @__PURE__ */ jsx(Icon, { name: icon }),
		/* @__PURE__ */ jsx("span", {
			className: helpers_module_default.bannerText,
			children
		}),
		action,
		onDismiss && /* @__PURE__ */ jsx(Button, {
			type: "button",
			variant: "ghost",
			size: "icon-sm",
			"aria-label": "Dismiss banner",
			onClick: onDismiss,
			children: /* @__PURE__ */ jsx(Icon, { name: "x" })
		})
	]
});
export { Alert, AlertAction, AlertDescription, AlertTitle, Banner };

//# sourceMappingURL=alert.js.map