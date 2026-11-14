import * as React from "react";
// src/lib/sortable.ts
var moveItem = (list, from, to) => {
	const next = [...list];
	const [item] = next.splice(from, 1);
	next.splice(to, 0, item);
	return next;
};
/**
* The pick-up, move, drop and cancel model every sortable surface shares: Space or Enter picks up and
* drops, arrow keys move the held item by the delta the surface maps them to, Escape cancels, Tab or
* blur drops, and Alt with an arrow moves one step without picking up. The item stays in items until
* the drop, so a surface previews the move from lift and commits through onReorder once.
*/
function useSortable({ items, getKey, getLabel, onReorder }) {
	const [lift, setLiftState] = React.useState(null);
	const [announcement, setAnnouncement] = React.useState("");
	const liftRef = React.useRef(null);
	const focusKey = React.useRef(null);
	const container = React.useRef(null);
	const instructions = React.useId();
	const total = items.length;
	React.useLayoutEffect(() => {
		const key = focusKey.current;
		if (!key || !container.current) return;
		focusKey.current = null;
		const handle = Array.from(container.current.querySelectorAll("[data-sortable-handle]")).find((element) => element.dataset.sortableHandle === key);
		if (handle && handle.ownerDocument.activeElement !== handle) handle.focus({ preventScroll: true });
	});
	const setLift = (next) => {
		liftRef.current = next;
		setLiftState(next);
	};
	const position = (index) => `position ${index + 1} of ${total}`;
	const labelOf = (key) => {
		const item = items.find((candidate) => getKey(candidate) === key);
		return item === void 0 ? "" : getLabel(item);
	};
	const pick = (item, pointer) => {
		const from = items.indexOf(item);
		if (from < 0) return;
		setLift({
			key: getKey(item),
			from,
			to: from,
			pointer
		});
		if (pointer) {
			const release = () => {
				window.removeEventListener("pointerup", release);
				window.removeEventListener("pointercancel", release);
				if (liftRef.current?.pointer) drop();
			};
			window.addEventListener("pointerup", release);
			window.addEventListener("pointercancel", release);
			return;
		}
		setAnnouncement(`Picked up ${getLabel(item)}, ${position(from)}. Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`);
	};
	const moveTo = (target) => {
		const current = liftRef.current;
		if (!current) return;
		const to = Math.min(Math.max(target, 0), total - 1);
		if (to === current.to) return;
		setLift({
			...current,
			to
		});
		if (current.pointer) return;
		focusKey.current = current.key;
		setAnnouncement(`Moved ${labelOf(current.key)} to ${position(to)}.`);
	};
	const drop = () => {
		const current = liftRef.current;
		if (!current) return;
		setLift(null);
		focusKey.current = current.key;
		if (current.to !== current.from) onReorder(moveItem(items, current.from, current.to));
		setAnnouncement(`Dropped ${labelOf(current.key)} at ${position(current.to)}.`);
	};
	const cancel = () => {
		const current = liftRef.current;
		if (!current) return;
		setLift(null);
		focusKey.current = current.key;
		setAnnouncement(`Cancelled. ${labelOf(current.key)} returned to ${position(current.from)}.`);
	};
	/** delta is how far the pressed key moves the item, 0 for a key that is not a move. */
	const keyDown = (event, item, delta) => {
		const key = getKey(item);
		const current = liftRef.current;
		const confirm = event.key === " " || event.key === "Enter";
		if (current?.key === key && !current.pointer) {
			if (confirm) {
				event.preventDefault();
				drop();
			} else if (event.key === "Escape") {
				event.preventDefault();
				cancel();
			} else if (delta) {
				event.preventDefault();
				moveTo(current.to + delta);
			} else if (event.key === "Tab") drop();
			return;
		}
		if (current) return;
		if (confirm) {
			event.preventDefault();
			pick(item, false);
		} else if (delta && event.altKey) {
			event.preventDefault();
			const from = items.indexOf(item);
			const to = from + delta;
			if (to < 0 || to >= total) return;
			onReorder(moveItem(items, from, to));
			focusKey.current = key;
			setAnnouncement(`Moved ${getLabel(item)} to ${position(to)}.`);
		}
	};
	const blur = (event, item) => {
		const current = liftRef.current;
		if (current?.key === getKey(item) && !current.pointer && event.relatedTarget) drop();
	};
	return {
		lift,
		liftRef,
		preview: lift ? moveItem(items, lift.from, lift.to) : items,
		announcement,
		instructions,
		container,
		pick,
		moveTo,
		drop,
		cancel,
		keyDown,
		blur
	};
}
export { moveItem, useSortable };

//# sourceMappingURL=sortable.js.map