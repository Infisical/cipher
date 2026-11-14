import { Separator as Separator$1 } from "./separator.js";
import { useDescendantFlags } from "../lib/descendant-flags.js";
import { useInFrame } from "../lib/frame-context.js";
import { cn } from "../lib/utils.js";
import { Icon } from "./icon.js";
import { Tooltip as Tooltip$1 } from "./tooltip.js";
import controls_module_default from "./controls.module.js";
import helpers_module_default from "./helpers.module.js";
import item_module_default from "./item.module.js";
import * as React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Slot } from "radix-ui";
import { cva } from "class-variance-authority";
// src/ui/item.tsx
var ItemGroupContext = React.createContext(false);
var groupFlags = {
	"data-has-sm": "[data-size=\"sm\"]",
	"data-has-xs": "[data-size=\"xs\"]"
};
var groupWatch = { attributes: ["data-size"] };
var itemFlags = { "data-has-description": "[data-slot=\"item-description\"]" };
function ItemGroup({ className, ref, ...props }) {
	const groupRef = useDescendantFlags(groupFlags, groupWatch, ref);
	return /* @__PURE__ */ jsx(ItemGroupContext, {
		value: true,
		children: /* @__PURE__ */ jsx("div", {
			ref: groupRef,
			role: "list",
			"data-slot": "item-group",
			className: cn("group/item-group flex w-full flex-col gap-4 data-[has-sm]:gap-2.5 data-[has-xs]:gap-2", className),
			...props
		})
	});
}
ItemGroup.displayName = "ItemGroup";
function ItemSeparator({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx(Separator$1, {
		ref,
		"data-slot": "item-separator",
		orientation: "horizontal",
		className: cn("my-2", className),
		...props
	});
}
ItemSeparator.displayName = "ItemSeparator";
var itemVariants = cva([controls_module_default.focusOutline, "group/item flex w-full flex-wrap rounded-lg text-sm transition-colors duration-(--cipher-duration-fast) [a]:transition-colors [a]:hover:bg-[color:var(--cipher-action-ghost-hover)]"], {
	variants: {
		variant: {
			default: "border border-transparent",
			outline: "border border-[color:var(--cipher-line-soft)]",
			muted: "border border-transparent bg-muted/50"
		},
		size: {
			default: "gap-2.5 px-3 py-2.5",
			md: "gap-2.5 px-3 py-2.5",
			sm: "gap-2.5 px-3 py-2.5",
			xs: "gap-2 px-3 py-2 in-data-[slot=dropdown-menu-content]:p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function ClampedTitle({ lines, className, children }) {
	const [element, setElement] = React.useState(null);
	const [clamped, setClamped] = React.useState(false);
	React.useLayoutEffect(() => {
		if (!element) return;
		const measure = () => setClamped(element.scrollHeight > element.clientHeight + 1);
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, [
		element,
		lines,
		children
	]);
	return /* @__PURE__ */ jsx(Tooltip$1, {
		content: clamped ? children : void 0,
		children: /* @__PURE__ */ jsx("span", {
			ref: setElement,
			className,
			style: { WebkitLineClamp: lines },
			children
		})
	});
}
var hasVisibleText = (root) => {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	for (let node = walker.nextNode(); node; node = walker.nextNode()) {
		if (!node.textContent?.trim()) continue;
		let element = node.parentElement;
		while (element && element !== root && element.offsetWidth > 1) element = element.parentElement;
		if (element === root) return true;
	}
	return false;
};
function useIconOnly(enabled) {
	const [element, setElement] = React.useState(null);
	const [iconOnly, setIconOnly] = React.useState(false);
	React.useLayoutEffect(() => {
		if (!enabled || !element) return setIconOnly(false);
		const sync = () => setIconOnly(!hasVisibleText(element));
		sync();
		const observer = new MutationObserver(sync);
		observer.observe(element, {
			childList: true,
			subtree: true,
			characterData: true
		});
		return () => observer.disconnect();
	}, [enabled, element]);
	return [iconOnly, setElement];
}
function Item({ className, variant = "default", size = "default", asChild = false, title, description, icon, media, badge, meta, error, actions, actionsPlacement = "end", unread, resolved, truncate, titleLines, mono = false, children, ref, ...props }) {
	const inList = React.useContext(ItemGroupContext);
	const Comp = asChild ? Slot.Root : "div";
	const itemRef = useDescendantFlags(itemFlags, void 0, ref);
	const composed = title !== void 0 || media || icon || description || actions;
	const hasActions = Boolean(actions) && (size === "default" || size === "md");
	const truncated = truncate ?? !hasActions;
	const [actionsIconOnly, actionsRef] = useIconOnly(hasActions);
	const metaNode = meta && /* @__PURE__ */ jsx("span", {
		className: cn(item_module_default.meta, typeof meta === "string" && item_module_default.mono),
		children: meta
	});
	const body = composed ? /* @__PURE__ */ jsxs(Fragment, { children: [
		unread && /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Unread"
		}),
		(media || icon) && /* @__PURE__ */ jsxs("span", {
			className: item_module_default.lead,
			children: [media ?? /* @__PURE__ */ jsx(Media, {
				icon,
				size: size === "sm" ? "sm" : "md"
			}), unread && /* @__PURE__ */ jsx("span", {
				className: item_module_default.unread,
				"aria-hidden": "true"
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: item_module_default.main,
			"data-actions-below": Boolean(actions || meta) && actionsPlacement === "below" && size !== "sm" || void 0,
			"data-has-actions": hasActions || void 0,
			"data-actions-icon-only": hasActions && actionsIconOnly || void 0,
			children: [/* @__PURE__ */ jsxs("div", {
				className: item_module_default.copy,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: item_module_default.titleLine,
						children: [
							unread && !(media || icon) && /* @__PURE__ */ jsx("span", {
								className: item_module_default.unread,
								"aria-hidden": "true"
							}),
							titleLines ? /* @__PURE__ */ jsx(ClampedTitle, {
								lines: titleLines,
								className: cn(item_module_default.title, item_module_default.clamp, mono && item_module_default.mono),
								children: title
							}) : /* @__PURE__ */ jsx("span", {
								className: cn(item_module_default.title, mono && item_module_default.mono),
								title: truncated && typeof title === "string" ? title : void 0,
								children: title
							}),
							badge,
							hasActions && metaNode
						]
					}),
					description && /* @__PURE__ */ jsx("div", {
						className: item_module_default.description,
						title: truncated && typeof description === "string" ? description : void 0,
						children: description
					}),
					error && /* @__PURE__ */ jsxs("div", {
						className: item_module_default.error,
						children: [/* @__PURE__ */ jsx(Icon, {
							name: "alert",
							size: 14
						}), error]
					}),
					children && !asChild && /* @__PURE__ */ jsx("div", {
						className: item_module_default.body,
						children
					})
				]
			}), (actions || meta) && /* @__PURE__ */ jsxs("div", {
				ref: actionsRef,
				className: cn(item_module_default.actions, actionsPlacement === "below" && size !== "sm" && item_module_default.below),
				children: [!hasActions && metaNode, actions]
			})]
		})
	] }) : children;
	const content = composed && asChild && React.isValidElement(children) ? React.cloneElement(children, void 0, body) : body;
	const item = /* @__PURE__ */ jsx(Comp, {
		ref: itemRef,
		role: inList && !asChild ? "listitem" : void 0,
		"data-slot": "item",
		"data-variant": variant,
		"data-size": size,
		"data-unread": unread || void 0,
		"data-resolved": resolved || void 0,
		"data-has-actions": composed && hasActions || void 0,
		className: cn(itemVariants({
			variant,
			size
		}), composed ? item_module_default.layout : "items-center", !truncated && item_module_default.wrap, className),
		...props,
		children: content
	});
	return inList && asChild ? /* @__PURE__ */ jsx("div", {
		role: "listitem",
		children: item
	}) : item;
}
Item.displayName = "Item";
var itemMediaVariants = cva("flex shrink-0 items-center justify-center gap-2 group-data-[has-description]/item:translate-y-0.5 group-data-[has-description]/item:self-start [&_svg]:pointer-events-none", {
	variants: { variant: {
		default: "bg-transparent",
		icon: "[&_svg:not([class*='size-'])]:size-4",
		image: "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover"
	} },
	defaultVariants: { variant: "default" }
});
function ItemMedia({ className, variant = "default", ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-media",
		"data-variant": variant,
		className: cn(itemMediaVariants({
			variant,
			className
		})),
		...props
	});
}
ItemMedia.displayName = "ItemMedia";
function ItemContent({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-content",
		className: cn("flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none", className),
		...props
	});
}
ItemContent.displayName = "ItemContent";
function ItemTitle({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-title",
		className: cn(item_module_default.title, "line-clamp-1 flex w-fit items-center gap-2 underline-offset-4", className),
		...props
	});
}
ItemTitle.displayName = "ItemTitle";
function ItemDescription({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("p", {
		ref,
		"data-slot": "item-description",
		className: cn(item_module_default.partDescription, "text-muted-foreground [&>a:hover]:text-primary line-clamp-2 text-left [&>a]:underline [&>a]:underline-offset-4", className),
		...props
	});
}
ItemDescription.displayName = "ItemDescription";
function ItemActions({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-actions",
		className: cn("flex items-center gap-2", className),
		...props
	});
}
ItemActions.displayName = "ItemActions";
function ItemHeader({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-header",
		className: cn("flex basis-full items-center justify-between gap-2", className),
		...props
	});
}
ItemHeader.displayName = "ItemHeader";
function ItemFooter({ className, ref, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": "item-footer",
		className: cn("flex basis-full items-center justify-between gap-2", className),
		...props
	});
}
ItemFooter.displayName = "ItemFooter";
function Media({ icon, size = "md", tone, children, className, style, ref, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		ref,
		"data-slot": "media",
		"data-size": typeof size === "number" ? void 0 : size,
		"data-tone": tone,
		className: cn(helpers_module_default.media, item_module_default.media, size === "sm" && helpers_module_default.mediaSmall, className),
		style: {
			...typeof size === "number" ? {
				width: size,
				height: size
			} : {},
			...style
		},
		...props,
		children: icon ? /* @__PURE__ */ jsx(Icon, {
			name: icon,
			size: size === "sm" || typeof size === "number" && size <= 28 ? 14 : 18
		}) : children
	});
}
Media.displayName = "Media";
function Tile({ selected, title, description, media, children, className, type = "button", ref, ...props }) {
	const inFrame = useInFrame("Tile");
	return /* @__PURE__ */ jsxs("button", {
		ref,
		type,
		"data-slot": "tile",
		"data-in-frame": inFrame || void 0,
		"aria-pressed": selected,
		className: cn(helpers_module_default.tile, className),
		...props,
		children: [
			media && /* @__PURE__ */ jsx("span", {
				className: item_module_default.lead,
				children: media
			}),
			/* @__PURE__ */ jsx("span", {
				className: helpers_module_default.tileBody,
				children: title !== void 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
					/* @__PURE__ */ jsx("span", {
						className: item_module_default.tileTitle,
						title: typeof title === "string" ? title : void 0,
						children: title
					}),
					description && /* @__PURE__ */ jsx("span", {
						className: cn(item_module_default.description, item_module_default.tileDescription),
						children: description
					}),
					children
				] }) : children
			}),
			/* @__PURE__ */ jsx(Icon, { name: selected ? "check" : "chev-right" })
		]
	});
}
Tile.displayName = "Tile";
export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle, Media, Tile };

//# sourceMappingURL=item.js.map