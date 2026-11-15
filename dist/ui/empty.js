import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import empty_module_default from "./empty.module.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/empty.tsx
function Empty({ className, size = "default", ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "empty",
		"data-size": size,
		className: cn(empty_module_default.root, className),
		...props
	});
}
Empty.displayName = "Empty";
function EmptyHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "empty-header",
		className: cn(empty_module_default.header, className),
		...props
	});
}
EmptyHeader.displayName = "EmptyHeader";
function EmptyMedia({ className, variant = "tile", ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "empty-media",
		"data-variant": variant,
		className: cn(empty_module_default.media, className),
		...props
	});
}
EmptyMedia.displayName = "EmptyMedia";
function EmptyTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "empty-title",
		className: cn(controls_module_default.sectionTitle, empty_module_default.title, className),
		...props
	});
}
EmptyTitle.displayName = "EmptyTitle";
function EmptyDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "empty-description",
		className: cn(controls_module_default.supporting, empty_module_default.description, className),
		...props
	});
}
function EmptyContent({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "empty-content",
		className: cn(empty_module_default.content, className),
		...props
	});
}
EmptyContent.displayName = "EmptyContent";
var EmptyState = ({ title, description, actions, icon = "inbox", media = "tile", size = "default" }) => /* @__PURE__ */ jsxs(Empty, {
	size,
	children: [
		/* @__PURE__ */ jsx(EmptyMedia, {
			variant: media,
			children: /* @__PURE__ */ jsx(Icon, { icon })
		}),
		/* @__PURE__ */ jsxs(EmptyHeader, { children: [/* @__PURE__ */ jsx(EmptyTitle, { children: title }), description && /* @__PURE__ */ jsx(EmptyDescription, { children: description })] }),
		actions && /* @__PURE__ */ jsx(EmptyContent, { children: actions })
	]
});
export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyState, EmptyTitle };

//# sourceMappingURL=empty.js.map