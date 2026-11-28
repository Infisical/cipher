"use client";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Icon } from "./icon.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/alert.tsx
var alertFlags = {
	"data-has-icon": ":scope > svg",
	"data-has-title": `:scope > :is(.${helpers_module_default.alertTitle}, .${helpers_module_default.alertTitleRow})`,
	"data-has-action": ":scope > [data-slot=\"alert-action\"]"
};
var alertWatch = { subtree: false };
function Alert({ className, variant, tone = variant === "destructive" ? "bad" : "neutral", title, badges, actions, onDismiss, band, children, ref, ...props }) {
	const alertRef = useDescendantFlags(alertFlags, alertWatch, ref);
	const titled = title != null && title !== false;
	const composed = React.Children.toArray(children).some((child) => React.isValidElement(child) && (child.type === AlertTitle || child.type === AlertDescription || child.type === Icon || child.type === "svg"));
	return /* @__PURE__ */ jsxs("div", {
		ref: alertRef,
		"data-slot": "alert",
		"data-variant": variant ?? "default",
		role: tone === "bad" ? "alert" : "status",
		"data-tone": tone,
		"data-band": band || void 0,
		className: cn(helpers_module_default.alert, "[&>svg]:cipher-lead-line", className),
		...props,
		children: [composed ? children : /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Icon, { name: tone === "bad" ? "alert-c" : tone === "ok" ? "check-c" : tone === "warn" ? "alert" : "info" }),
			titled && (badges ? /* @__PURE__ */ jsxs("div", {
				className: cn(helpers_module_default.alertTitleRow, helpers_module_default.titleWithBadges),
				children: [/* @__PURE__ */ jsx(AlertTitle, { children: title }), /* @__PURE__ */ jsx("span", {
					"data-slot": "alert-badges",
					className: helpers_module_default.titleBadges,
					children: badges
				})]
			}) : /* @__PURE__ */ jsx(AlertTitle, { children: title })),
			/* @__PURE__ */ jsxs(AlertDescription, { children: [badges && !titled ? /* @__PURE__ */ jsxs("div", {
				className: helpers_module_default.alertLine,
				children: [/* @__PURE__ */ jsx("div", { children }), /* @__PURE__ */ jsx("span", {
					"data-slot": "alert-trailing",
					className: helpers_module_default.alertTrailing,
					children: badges
				})]
			}) : children, actions && /* @__PURE__ */ jsx("div", {
				className: helpers_module_default.alertActions,
				children: actions
			})] })
		] }), onDismiss && /* @__PURE__ */ jsx(AlertAction, { children: /* @__PURE__ */ jsx(Button, {
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
		/* @__PURE__ */ jsxs("span", {
			className: helpers_module_default.bannerLead,
			children: [/* @__PURE__ */ jsx(Icon, {
				icon,
				lead: true
			}), /* @__PURE__ */ jsx("span", {
				className: helpers_module_default.bannerText,
				children
			})]
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