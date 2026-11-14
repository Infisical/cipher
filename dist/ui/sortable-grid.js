import { snap, spring } from "../lib/motion.js";
import { useSortable } from "../lib/sortable.js";
import { cn } from "../lib/utils.js";
import { SortableAnnouncer, SortableHandle } from "./sortable-list.js";
import sortable_grid_module_default from "./sortable-grid.module.js";
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/sortable-grid.tsx
var columnsOf = (container) => {
	const items = Array.from(container?.children ?? []);
	const top = items[0]?.offsetTop;
	return Math.max(1, items.filter((item) => item.offsetTop === top).length);
};
/** Items in responsive columns that a person puts in order, by dragging an item's grip or from the keyboard in two dimensions. */
function SortableGrid({ items, getKey, onReorder, renderItem, getLabel, label, minItemWidth = 240, disabled = false, isItemDisabled, className }) {
	const reduced = useReducedMotion();
	const sort = useSortable({
		items,
		getKey,
		getLabel,
		onReorder
	});
	const list = React.useRef(null);
	const delta = (key) => {
		if (key === "ArrowLeft") return -1;
		if (key === "ArrowRight") return 1;
		const columns = columnsOf(list.current);
		if (key === "ArrowUp") return -columns;
		if (key === "ArrowDown") return columns;
		return 0;
	};
	const follow = (event) => {
		const target = Array.from(list.current?.children ?? []).findIndex((element) => {
			const box = element.getBoundingClientRect();
			return event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
		});
		if (target >= 0) sort.moveTo(target);
	};
	const startDrag = (item) => {
		sort.pick(item, true);
		const stop = () => {
			window.removeEventListener("pointermove", follow);
			window.removeEventListener("pointerup", stop);
			window.removeEventListener("pointercancel", stop);
		};
		window.addEventListener("pointermove", follow);
		window.addEventListener("pointerup", stop);
		window.addEventListener("pointercancel", stop);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: cn(sortable_grid_module_default.shell, className),
		"data-slot": "sortable-grid",
		"data-disabled": disabled || void 0,
		children: [/* @__PURE__ */ jsx("ul", {
			ref: (node) => {
				list.current = node;
				sort.container.current = node;
			},
			className: sortable_grid_module_default.grid,
			"aria-label": label,
			style: { "--cipher-sortable-grid-min": `${minItemWidth}px` },
			children: sort.preview.map((item, index) => {
				const key = getKey(item);
				const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
				const lifted = sort.lift?.key === key;
				return /* @__PURE__ */ jsx(motion.li, {
					layout: "position",
					transition: reduced ? snap : spring.moderate,
					className: sortable_grid_module_default.item,
					"data-slot": "sortable-grid-item",
					"data-dragging": lifted || void 0,
					"data-disabled": itemDisabled || void 0,
					children: renderItem(item, {
						index,
						dragging: lifted,
						disabled: itemDisabled,
						handle: /* @__PURE__ */ jsx(SortableHandle, {
							itemKey: key,
							label: getLabel(item),
							instructions: sort.instructions,
							lifted: lifted && !sort.lift?.pointer,
							disabled: itemDisabled,
							onPointerDown: () => {
								if (!sort.lift) startDrag(item);
							},
							onKeyDown: (event) => sort.keyDown(event, item, delta(event.key)),
							onBlur: (event) => sort.blur(event, item)
						})
					})
				}, key);
			})
		}), /* @__PURE__ */ jsx(SortableAnnouncer, {
			instructions: sort.instructions,
			announcement: sort.announcement,
			children: "Press Space or Enter to pick up, then use the arrow keys to move across and between rows. Alt with an arrow key moves one step."
		})]
	});
}
export { SortableGrid };

//# sourceMappingURL=sortable-grid.js.map