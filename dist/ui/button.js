import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Spinner } from "./spinner.js";
import { Tooltip as Tooltip$1 } from "./tooltip.js";
import button_geometry_module_default from "./button-geometry.module.js";
import button_material_module_default from "./button-material.module.js";
import controls_module_default from "./controls.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/button.tsx
var buttonVariants = cva([
	button_geometry_module_default.button,
	controls_module_default.focusOutline,
	"group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-border whitespace-nowrap select-none disabled:pointer-events-none aria-invalid:border-[color:var(--v4-control-invalid-border)] [&_svg]:pointer-events-none [&_svg]:shrink-0"
], {
	variants: {
		variant: {
			primary: button_material_module_default.ink,
			accent: button_material_module_default.material,
			"danger-ghost": "text-destructive hover:bg-destructive/10",
			default: button_material_module_default.ink,
			outline: ["border-[color:var(--v4-action-outline-border)] bg-[color:var(--v4-action-outline-surface)] hover:bg-[color:var(--v4-action-outline-hover)] hover:text-foreground [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:bg-muted [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:text-foreground", button_material_module_default.neutralSelection],
			secondary: ["bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:bg-secondary [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:text-secondary-foreground", button_material_module_default.neutralSelection],
			ghost: ["hover:bg-[color:var(--v4-action-ghost-hover)] hover:text-foreground [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:bg-[color:var(--v4-action-ghost-hover)] [&[aria-haspopup]:is([data-state=open],[aria-expanded=true])]:text-foreground", button_material_module_default.neutralSelection],
			destructive: button_material_module_default.danger,
			link: button_material_module_default.link
		},
		size: {
			md: button_geometry_module_default.regular,
			default: button_geometry_module_default.default,
			xs: button_geometry_module_default.extraSmall,
			sm: button_geometry_module_default.default,
			lg: button_geometry_module_default.large,
			icon: button_geometry_module_default.icon,
			"icon-xs": button_geometry_module_default.iconExtraSmall,
			"icon-sm": button_geometry_module_default.iconSmall,
			"icon-lg": button_geometry_module_default.iconLarge,
			"icon-row": button_geometry_module_default.iconRow
		}
	},
	compoundVariants: [{
		variant: [
			"primary",
			"default",
			"danger-ghost",
			"outline",
			"secondary",
			"ghost",
			"link"
		],
		className: [
			button_material_module_default.paintTransition,
			"disabled:opacity-50",
			button_material_module_default.reasonDisabled
		]
	}, {
		variant: "destructive",
		className: button_material_module_default.paintTransition
	}],
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant = "default", size = "default", asChild = false, loading: loadingProp, icon, iconRight, iconOnly = false, selected, disabledReason, cornerBadge, layout, underline, children, onClickCapture, onPointerDownCapture, onKeyDownCapture, onPointerDown, onPointerUp, onPointerLeave, onPointerCancel, style, type, ref, ...props }) {
	const Comp = asChild ? Slot.Root : "button";
	const loading = loadingProp ?? false;
	const reason = disabledReason || void 0;
	const inactive = loading || Boolean(reason) || props.disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true";
	const material = variant === "accent";
	const preventActivation = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};
	const popup = props["aria-haspopup"];
	const hasPopup = popup !== void 0 && popup !== false && popup !== "false";
	const activationKey = (key) => key === "Enter" || key === " " || hasPopup && (key === "ArrowDown" || key === "ArrowUp");
	const progress = /* @__PURE__ */ jsx(Spinner, {
		"data-slot": "button-progress",
		className: button_material_module_default.progress,
		"data-active": loading || void 0
	});
	let iconSize = 14;
	if (size === "xs" || size === "icon-xs") iconSize = 12;
	else if (size === "md" || size === "lg") iconSize = 16;
	else if (size === "icon-row") iconSize = void 0;
	const trigger = layout === "trigger";
	const content = (label) => {
		const labelGroup = trigger ? /* @__PURE__ */ jsxs(Fragment, { children: [
			icon && /* @__PURE__ */ jsx(Icon, {
				name: icon,
				size: iconSize,
				"data-button-icon": ""
			}),
			/* @__PURE__ */ jsx("span", {
				"data-slot": "button-label",
				className: button_geometry_module_default.triggerLabel,
				children: label
			}),
			/* @__PURE__ */ jsx(Icon, {
				name: iconRight ?? "chev-down",
				"data-slot": "button-chevron",
				className: button_geometry_module_default.triggerChevron
			})
		] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
			icon && /* @__PURE__ */ jsx(Icon, {
				name: icon,
				size: iconSize,
				"data-button-icon": ""
			}),
			iconOnly && (icon || iconRight) ? /* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: label
			}) : label,
			iconRight && /* @__PURE__ */ jsx(Icon, {
				name: iconRight,
				size: iconSize
			})
		] });
		if (loadingProp === void 0) return labelGroup;
		return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
			"data-slot": "button-label-group",
			className: button_material_module_default.labelGroup,
			children: labelGroup
		}), progress] });
	};
	const badge = cornerBadge ? /* @__PURE__ */ jsx("span", {
		"data-slot": "button-corner-badge",
		className: button_geometry_module_default.cornerBadge,
		children: cornerBadge
	}) : null;
	const child = asChild && React.isValidElement(children) ? React.cloneElement(children, inactive ? {
		onClickCapture: preventActivation,
		onPointerDownCapture: preventActivation,
		onKeyDownCapture: (event) => {
			if (activationKey(event.key)) preventActivation(event);
			else children.props.onKeyDownCapture?.(event);
		}
	} : void 0, /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		"data-press": "",
		children: content(children.props.children)
	}), badge] })) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		"data-press": "",
		children: content(children)
	}), badge] });
	const button = /* @__PURE__ */ jsx(Comp, {
		ref,
		"data-slot": "button",
		"data-variant": variant,
		"data-size": size,
		"data-layout": layout,
		"data-underline": variant === "link" ? underline ?? "always" : void 0,
		type: asChild ? type : type ?? "button",
		...props,
		disabled: reason ? void 0 : props.disabled,
		"data-v4-button": "",
		"data-v4-button-material": material ? "" : void 0,
		"data-disabled-reason": reason ? "" : void 0,
		"aria-busy": loading || void 0,
		"aria-disabled": loading || Boolean(reason) || props.disabled || props["aria-disabled"] || void 0,
		"aria-description": reason ?? props["aria-description"],
		"aria-pressed": selected ?? props["aria-pressed"],
		className: cn(buttonVariants({
			variant,
			size
		}), iconOnly && button_geometry_module_default.iconOnly, badge && button_geometry_module_default.badged, trigger && button_geometry_module_default.triggerLayout, loadingProp !== void 0 && !iconOnly && button_material_module_default.pendable, loading && button_material_module_default.pending, className),
		style,
		onPointerDown,
		onPointerUp,
		onPointerLeave,
		onPointerCancel,
		onPointerDownCapture: (event) => {
			if (inactive) preventActivation(event);
			else onPointerDownCapture?.(event);
		},
		onKeyDownCapture: (event) => {
			if (inactive && activationKey(event.key)) preventActivation(event);
			else onKeyDownCapture?.(event);
		},
		onClickCapture: (event) => {
			if (inactive) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			onClickCapture?.(event);
		},
		children: child
	});
	return reason ? /* @__PURE__ */ jsx(Tooltip$1, {
		content: reason,
		children: button
	}) : button;
}
Button.displayName = "Button";
export { Button, buttonVariants };

//# sourceMappingURL=button.js.map