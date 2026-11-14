import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import helpers_module_default from "./helpers.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Avatar as Avatar$1 } from "radix-ui";
// src/ui/avatar.tsx
function Avatar({ className, size = "default", name, initials, label, kind = "person", status, ring, children, ref, ...props }) {
	if (![
		"person",
		"machine",
		"agent",
		"fallback"
	].includes(kind)) return null;
	const dimension = typeof size === "number" && Number.isFinite(size) && size > 0 ? size : size === "sm" ? 24 : size === "lg" ? 40 : 32;
	return /* @__PURE__ */ jsxs(Avatar$1.Root, {
		ref,
		"data-slot": "avatar",
		"data-kind": kind,
		"data-size": typeof size === "number" ? void 0 : size,
		role: name || label ? "img" : void 0,
		"aria-label": label ?? name,
		style: {
			width: dimension,
			height: dimension,
			fontSize: dimension <= 24 ? 10 : dimension <= 32 ? 12 : Math.round(dimension * .35),
			...props.style
		},
		className: cn("group/avatar relative flex shrink-0 select-none", helpers_module_default.avatarShape, ring && helpers_module_default.avatarRing, className),
		...props,
		children: [children ?? /* @__PURE__ */ jsx(AvatarFallback, { children: kind === "machine" || kind === "agent" || kind === "fallback" ? /* @__PURE__ */ jsx(Icon, { name: kind === "machine" ? "machine" : kind === "agent" ? "agent" : "user" }) : initials ?? name?.trim().split(/[\s._-]+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() ?? "?" }), status && /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			"data-status": status,
			className: helpers_module_default.avatarStatus
		})]
	});
}
Avatar.displayName = "Avatar";
function AvatarImage({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Avatar$1.Image, {
		ref,
		"data-slot": "avatar-image",
		className: cn("aspect-square size-full object-cover", className),
		...props
	});
}
AvatarImage.displayName = "AvatarImage";
function AvatarFallback({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Avatar$1.Fallback, {
		ref,
		"data-slot": "avatar-fallback",
		className: cn(helpers_module_default.avatarFallback, "flex size-full items-center justify-center", className),
		...props
	});
}
AvatarFallback.displayName = "AvatarFallback";
function AvatarBadge({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "avatar-badge",
		className: cn("text-primary-foreground bg-primary absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 ring-background select-none", "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden", "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2", "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2", className),
		...props
	});
}
AvatarBadge.displayName = "AvatarBadge";
function AvatarGroup({ className, children, max, size = 32, label, ref, ...props }) {
	const all = React.Children.toArray(children);
	const limit = max === void 0 ? all.length : Math.max(0, Math.floor(max));
	return /* @__PURE__ */ jsxs("div", {
		ref,
		role: "group",
		"aria-label": label,
		"data-slot": "avatar-group",
		className: cn(helpers_module_default.avatarGroup, className),
		...props,
		children: [all.slice(0, limit).map((child) => React.isValidElement(child) && child.type === Avatar ? React.cloneElement(child, {
			size: child.props.size ?? size,
			ring: true
		}) : child), all.length > limit && /* @__PURE__ */ jsx(Avatar, {
			size,
			initials: `+${all.length - limit}`,
			label: `${all.length - limit} more`,
			ring: true
		})]
	});
}
AvatarGroup.displayName = "AvatarGroup";
function AvatarGroupCount({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "avatar-group-count",
		className: cn("relative flex size-8 shrink-0 items-center justify-center [&>svg]:size-4", helpers_module_default.avatarCount, className),
		...props
	});
}
AvatarGroupCount.displayName = "AvatarGroupCount";
var Identity = ({ name, description, mono = false, media, title, kind = "person", className }) => /* @__PURE__ */ jsxs("div", {
	"data-slot": "identity",
	className: cn(helpers_module_default.identity, className),
	children: [media ?? /* @__PURE__ */ jsx(Avatar, {
		name,
		kind
	}), /* @__PURE__ */ jsxs("div", {
		className: helpers_module_default.identityText,
		children: [/* @__PURE__ */ jsx("span", {
			className: cn(helpers_module_default.identityTitle, mono && helpers_module_default.mono),
			children: title ?? name
		}), description && /* @__PURE__ */ jsx("span", {
			className: helpers_module_default.identityDescription,
			children: description
		})]
	})]
});
export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage, Identity };

//# sourceMappingURL=avatar.js.map