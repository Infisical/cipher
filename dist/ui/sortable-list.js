import { FrameScope, useInFrame } from "../lib/frame-context.js";
import { snap, spring } from "../lib/motion.js";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import data_module_default from "./data.module.js";
import frame_module_default from "./frame.module.js";
import sortable_list_module_default from "./sortable-list.module.js";
import * as React from "react";
import { Reorder, useDragControls, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/sortable-list.tsx
var move = (list, from, to) => {
	const next = [...list];
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
};
function SortableList({ items, getKey, onReorder, renderItem, getLabel, label, variant: requestedVariant, size = "md", disabled = false, isItemDisabled, className }) {
	const variant = requestedVariant ?? "framed";
	const inFrame = useInFrame("SortableList", requestedVariant);
	const embedded = inFrame && variant === "framed";
	const framed = variant === "framed" && !embedded;
	const reduced = useReducedMotion();
	const instructions = React.useId();
	const [draft, setDraft] = React.useState(null);
	const [lifted, setLifted] = React.useState(null);
	const [announcement, setAnnouncement] = React.useState("");
	const draftRef = React.useRef(null);
	const origin = React.useRef(0);
	const focusKey = React.useRef(null);
	const list = React.useRef(null);
	const shown = draft ?? items;
	const total = shown.length;
	React.useLayoutEffect(() => {
		const key = focusKey.current;
		if (!key || !list.current) return;
		focusKey.current = null;
		const handle = Array.from(list.current.querySelectorAll("[data-sortable-handle]")).find((element) => element.dataset.sortableHandle === key);
		if (handle && handle.ownerDocument.activeElement !== handle) handle.focus({ preventScroll: true });
	});
	const updateDraft = (next) => {
		draftRef.current = next;
		setDraft(next);
	};
	const changed = (next) => next.some((item, index) => item !== items[index]);
	const position = (index) => `position ${index + 1} of ${total}`;
	const commit = (next, item) => {
		updateDraft(null);
		setLifted(null);
		if (!changed(next)) return false;
		onReorder(next);
		setAnnouncement(`Dropped ${getLabel(item)} at ${position(next.indexOf(item))}.`);
		return true;
	};
	const keyDown = (event, item) => {
		const key = getKey(item);
		const name = getLabel(item);
		const current = draftRef.current ?? [...items];
		const index = current.indexOf(item);
		const step = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
		if (lifted === key) {
			if (event.key === " " || event.key === "Enter") {
				event.preventDefault();
				if (!commit(current, item)) setAnnouncement(`Dropped ${name} at ${position(index)}.`);
			} else if (event.key === "Escape") {
				event.preventDefault();
				updateDraft(null);
				setLifted(null);
				focusKey.current = key;
				setAnnouncement(`Cancelled. ${name} returned to ${position(origin.current)}.`);
			} else if (step) {
				event.preventDefault();
				const target = index + step;
				if (target < 0 || target >= current.length) return;
				updateDraft(move(current, index, target));
				focusKey.current = key;
				setAnnouncement(`Moved ${name} to ${position(target)}.`);
			} else if (event.key === "Tab") commit(current, item);
			return;
		}
		if (event.key === " " || event.key === "Enter") {
			event.preventDefault();
			origin.current = index;
			updateDraft(current);
			setLifted(key);
			setAnnouncement(`Picked up ${name}, ${position(index)}. Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`);
		} else if (step && event.altKey) {
			event.preventDefault();
			const target = index + step;
			if (target < 0 || target >= current.length) return;
			onReorder(move(current, index, target));
			focusKey.current = key;
			setAnnouncement(`Moved ${name} to ${position(target)}.`);
		}
	};
	return /* @__PURE__ */ jsx(FrameScope, {
		framed: inFrame || framed,
		children: /* @__PURE__ */ jsxs("div", {
			className: cn(data_module_default.listShell, framed && frame_module_default.frame, className),
			"data-slot": "sortable-list",
			"data-variant": variant,
			"data-embedded": embedded || void 0,
			"data-size": size,
			"data-disabled": disabled || void 0,
			children: [
				/* @__PURE__ */ jsx(Reorder.Group, {
					ref: list,
					as: "ul",
					axis: "y",
					values: shown,
					onReorder: (next) => updateDraft(next),
					className: cn(data_module_default.list, framed && frame_module_default.frameInset),
					"aria-label": label,
					children: shown.map((item, index) => {
						const key = getKey(item);
						const itemDisabled = disabled || Boolean(isItemDisabled?.(item));
						return /* @__PURE__ */ jsx(SortableRow, {
							item,
							itemKey: key,
							label: getLabel(item),
							size,
							disabled: itemDisabled,
							lifted: lifted === key,
							instructions,
							transition: reduced ? snap : spring.moderate,
							onStart: () => {
								if (lifted) return;
								updateDraft([...items]);
							},
							onEnd: () => {
								const next = draftRef.current;
								if (next && !lifted) commit(next, item);
							},
							onKeyDown: (event) => keyDown(event, item),
							onBlur: (event) => {
								if (lifted === key && event.relatedTarget) {
									const next = draftRef.current;
									if (next) commit(next, item);
								}
							},
							children: renderItem(item, {
								index,
								dragging: lifted === key,
								disabled: itemDisabled
							})
						}, key);
					})
				}),
				/* @__PURE__ */ jsx("span", {
					id: instructions,
					className: data_module_default.sr,
					children: "Press Space or Enter to pick up, then use the arrow keys to move. Alt with an arrow key moves one step."
				}),
				/* @__PURE__ */ jsx("span", {
					className: data_module_default.sr,
					role: "status",
					"aria-live": "polite",
					"aria-atomic": "true",
					children: announcement
				})
			]
		})
	});
}
function SortableRow({ item, itemKey, label, size, disabled, lifted, instructions, transition, onStart, onEnd, onKeyDown, onBlur, children }) {
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
			onEnd();
		},
		className: cn(data_module_default.listRow, sortable_list_module_default.row),
		"data-slot": "sortable-list-item",
		"data-size": size,
		"data-disabled": disabled || void 0,
		"data-dragging": dragging || lifted || void 0,
		children: [/* @__PURE__ */ jsx("span", {
			className: sortable_list_module_default.handleSlot,
			children: /* @__PURE__ */ jsx(Button, {
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
					onStart();
					controls.start(event);
				},
				onKeyDown,
				onBlur,
				children: `Reorder ${label}`
			})
		}), /* @__PURE__ */ jsx("div", {
			className: sortable_list_module_default.body,
			children
		})]
	});
}
export { SortableList };

//# sourceMappingURL=sortable-list.js.map