import { snap, spring } from "../lib/motion.js";
import { useSortable } from "../lib/sortable.js";
import { cn } from "../lib/utils.js";
import { SortableAnnouncer, SortableHandle } from "./sortable-list.js";
import sortable_grid_module_default from "./sortable-grid.module.js";
import * as React from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/sortable-grid.tsx
var center = (box) => ({
	x: box.left + box.width / 2,
	y: box.top + box.height / 2
});
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
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const drag = React.useRef(null);
	const [held, setHeld] = React.useState(null);
	const origin = () => list.current?.getBoundingClientRect() ?? {
		left: 0,
		top: 0
	};
	const place = () => {
		const current = drag.current;
		const element = list.current?.querySelector("[data-following]");
		if (!current || !element) return;
		const box = element.getBoundingClientRect();
		x.set(current.pointer.x - current.grab.x - box.left);
		y.set(current.pointer.y - current.grab.y - box.top);
	};
	const follow = (event) => {
		const current = drag.current;
		const lift = sort.liftRef.current;
		if (!current || !lift) return;
		current.pointer = {
			x: event.clientX,
			y: event.clientY
		};
		const { left, top } = origin();
		const from = current.slots[lift.from];
		const card = {
			x: event.clientX - left - current.grab.x + from.width / 2,
			y: event.clientY - top - current.grab.y + from.height / 2
		};
		const distance = (box) => Math.hypot(center(box).x - card.x, center(box).y - card.y);
		let best = lift.to;
		current.slots.forEach((slot, index) => {
			if (distance(slot) < distance(current.slots[best])) best = index;
		});
		const slot = current.slots[lift.to];
		const hysteresis = Math.min(slot.width, slot.height) * .25;
		if (best !== lift.to && distance(current.slots[best]) < distance(slot) - hysteresis) sort.moveTo(best);
		else place();
	};
	React.useLayoutEffect(place, [sort.lift?.to]);
	const startDrag = (item, event) => {
		const container = list.current;
		if (!container) return;
		const { left, top } = container.getBoundingClientRect();
		const slots = Array.from(container.children).map((element) => {
			const box = element.getBoundingClientRect();
			return {
				left: box.left - left,
				top: box.top - top,
				width: box.width,
				height: box.height
			};
		});
		const from = slots[items.indexOf(item)];
		if (!from) return;
		const key = getKey(item);
		drag.current = {
			slots,
			grab: {
				x: event.clientX - left - from.left,
				y: event.clientY - top - from.top
			},
			pointer: {
				x: event.clientX,
				y: event.clientY
			}
		};
		x.set(0);
		y.set(0);
		setHeld(key);
		sort.pick(item, true);
		const stop = () => {
			window.removeEventListener("pointermove", follow);
			window.removeEventListener("pointerup", stop);
			window.removeEventListener("pointercancel", stop);
			drag.current = null;
			const settle = reduced ? snap : spring.moderate;
			Promise.all([animate(x, 0, settle), animate(y, 0, settle)]).then(() => setHeld((current) => current === key ? null : current));
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
				const following = held === key;
				return /* @__PURE__ */ jsx(motion.li, {
					layout: following ? false : "position",
					transition: reduced ? snap : spring.moderate,
					className: sortable_grid_module_default.item,
					"data-slot": "sortable-grid-item",
					"data-dragging": lifted || following || void 0,
					"data-following": following || void 0,
					"data-disabled": itemDisabled || void 0,
					children: /* @__PURE__ */ jsx(motion.div, {
						className: sortable_grid_module_default.card,
						style: following ? {
							x,
							y
						} : void 0,
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
								onPointerDown: (event) => {
									if (!sort.lift && !held) startDrag(item, event);
								},
								onKeyDown: (event) => sort.keyDown(event, item, delta(event.key)),
								onBlur: (event) => sort.blur(event, item)
							})
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