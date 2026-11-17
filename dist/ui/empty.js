import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import controls_module_default from "./controls.module.js";
import empty_module_default from "./empty.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/empty.tsx
var GHOSTS = [
	"a",
	"b",
	"c",
	"d",
	"e",
	"f"
];
var GhostContext = React.createContext(void 0);
/** Sets the ghost an Empty inside defaults to. Containers with an empty slot use it, so an explicit ghost on the Empty still wins. */
function EmptyGhostScope({ ghost, children }) {
	return /* @__PURE__ */ jsx(GhostContext, {
		value: ghost,
		children
	});
}
function Empty({ className, size = "default", ghost, children, ref, ...props }) {
	const inherited = React.useContext(GhostContext);
	const resolved = ghost === void 0 ? inherited : ghost;
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "empty",
		"data-size": size,
		"data-ghost": resolved || void 0,
		className: cn(empty_module_default.root, className),
		...props,
		children: [resolved && /* @__PURE__ */ jsx("div", {
			className: empty_module_default.ghosts,
			"aria-hidden": "true",
			children: GHOSTS.map((id) => /* @__PURE__ */ jsx("span", { className: empty_module_default.ghost }, id))
		}), children]
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
var EmptyState = ({ title, description, actions, icon = "inbox", media = "tile", size = "default", ghost }) => /* @__PURE__ */ jsxs(Empty, {
	size,
	ghost,
	children: [
		/* @__PURE__ */ jsx(EmptyMedia, {
			variant: media,
			children: /* @__PURE__ */ jsx(Icon, { icon })
		}),
		/* @__PURE__ */ jsxs(EmptyHeader, { children: [/* @__PURE__ */ jsx(EmptyTitle, { children: title }), description && /* @__PURE__ */ jsx(EmptyDescription, { children: description })] }),
		actions && /* @__PURE__ */ jsx(EmptyContent, { children: actions })
	]
});
export { Empty, EmptyContent, EmptyDescription, EmptyGhostScope, EmptyHeader, EmptyMedia, EmptyState, EmptyTitle };

//# sourceMappingURL=empty.js.map