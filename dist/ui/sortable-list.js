import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { snap, spring } from "../lib/motion.js";
import { useSortable } from "../lib/sortable.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import data_module_default from "./data.module.js";
import frame_module_default from "./frame.module.js";
import sortable_list_module_default from "./sortable-list.module.js";
import * as React from "react";
import { Reorder, useDragControls, useReducedMotion } from "motion/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
// src/ui/sortable-list.tsx
/** The grip button every sortable surface uses: label it with the item's name, and key it so focus follows the item through a move. */
function SortableHandle({ itemKey, label, instructions, lifted, disabled, onPointerDown, onKeyDown, onBlur }) {
	return /* @__PURE__ */ jsx(Button, {
		variant: "ghost",
		size: "icon-row",
		icon: "grip",
		iconOnly: true,
		className: sortable_list_module_default.handle,
		"aria-describedby": instructions,
		disabled,
		"data-sortable-handle": itemKey,
		"data-cipher-escape-owner": lifted || void 0,
		"data-lifted": lifted || void 0,
		onPointerDown: (event) => {
			if (disabled || event.button !== 0) return;
			event.preventDefault();
			onPointerDown(event);
		},
		onKeyDown,
		onBlur,
		children: `Reorder ${label}`
	});
}
/** Screen reader instructions for the handles and the live region that announces each move. */
function SortableAnnouncer({ instructions, announcement, children }) {
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", {
		id: instructions,
		className: data_module_default.sr,
		children
	}), /* @__PURE__ */ jsx("span", {
		className: data_module_default.sr,
		role: "status",
		"aria-live": "polite",
		"aria-atomic": "true",
		children: announcement
	})] });
}
function SortableList({ items, getKey, onReorder, renderItem, getLabel, label, variant: requestedVariant, size = "md", disabled = false, isItemDisabled, className }) {
	const variant = requestedVariant ?? "framed";
	const inFrame = useInFrame("SortableList", requestedVariant);
	const embedded = inFrame && variant === "framed";
	const framed = variant === "framed" && !embedded;
	const reduced = useReducedMotion();
	const sort = useSortable({
		items,
		getKey,
		getLabel,
		onReorder
	});
	const held = sort.lift ? items[sort.lift.from] : void 0;
	return /* @__PURE__ */ jsx(FrameScope, {
		framed: inFrame || framed,
		children: /* @__PURE__ */ jsxs("div", {
			className: cn(data_module_default.listShell, framed && frame_module_default.frame, className),
			"data-slot": "sortable-list",
			"data-variant": variant,
			"data-embedded": embedded || void 0,
			"data-size": size,
			"data-disabled": disabled || void 0,
			children: [/* @__PURE__ */ jsx(Reorder.Group, {
				ref: (node) => {
					sort.container.current = node;
				},
				as: "ul",
				axis: "y",
				values: sort.preview,
				onReorder: (next) => {
					if (held !== void 0) sort.moveTo(next.indexOf(held));
				},
				className: cn(data_module_default.list, framed && frame_module_default.frameInset),
				"aria-label": label,
				children: sort.preview.map((item, index) => {
					const key = getKey(item);
					const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
					const lifted = sort.lift?.key === key;
					return /* @__PURE__ */ jsx(SortableRow, {
						item,
						size,
						disabled: itemDisabled,
						lifted,
						transition: reduced ? snap : spring.moderate,
						onDragEnd: sort.drop,
						handle: (controls) => /* @__PURE__ */ jsx(SortableHandle, {
							itemKey: key,
							label: getLabel(item),
							instructions: sort.instructions,
							lifted: lifted && !sort.lift?.pointer,
							disabled: itemDisabled,
							onPointerDown: (event) => {
								if (sort.lift) return;
								sort.pick(item, true);
								controls.start(event);
							},
							onKeyDown: (event) => sort.keyDown(event, item, event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0),
							onBlur: (event) => sort.blur(event, item)
						}),
						children: renderItem(item, {
							index,
							dragging: lifted,
							disabled: itemDisabled
						})
					}, key);
				})
			}), /* @__PURE__ */ jsx(SortableAnnouncer, {
				instructions: sort.instructions,
				announcement: sort.announcement,
				children: "Press Space or Enter to pick up, then use the arrow keys to move. Alt with an arrow key moves one step."
			})]
		})
	});
}
function SortableRow({ item, size, disabled, lifted, transition, onDragEnd, handle, children }) {
	const controls = useDragControls();
	const [dragging, setDragging] = React.useState(false);
	return /* @__PURE__ */ jsxs(Reorder.Item, {
		as: "li",
		value: item,
		dragListener: false,
		dragControls: controls,
		transition,
		onDragStart: () => setDragging(true),
		onDragEnd: () => {
			setDragging(false);
			onDragEnd();
		},
		className: cn(data_module_default.listRow, sortable_list_module_default.row),
		"data-slot": "sortable-list-item",
		"data-size": size,
		"data-disabled": disabled || void 0,
		"data-dragging": dragging || lifted || void 0,
		children: [/* @__PURE__ */ jsx("span", {
			className: sortable_list_module_default.handleSlot,
			children: handle(controls)
		}), /* @__PURE__ */ jsx("div", {
			className: sortable_list_module_default.body,
			children
		})]
	});
}
export { SortableAnnouncer, SortableHandle, SortableList };

//# sourceMappingURL=sortable-list.js.map