import { fade, snap, spring } from "./motion.js";
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/lib/list-highlight.tsx
var LIST_HIGHLIGHT_ITEM = "[role=\"menuitem\"], [role=\"menuitemcheckbox\"], [role=\"menuitemradio\"], [role=\"option\"], [cmdk-item], [data-sidebar-target]";
var ACTIVE = "[data-highlighted], [cmdk-item][data-selected=\"true\"], [role=\"option\"][data-active]";
var CURRENT = "[data-current], [aria-current=\"page\"], [role=\"option\"][data-state=\"checked\"], [role=\"menuitemradio\"][aria-checked=\"true\"]";
var HOLDS = "[data-holds-current]";
var EXPANDED = "[aria-haspopup]:is([aria-expanded=\"true\"], [data-state=\"open\"])";
var DANGER = "[data-danger], [data-variant=\"destructive\"]";
var KEYS = [
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageUp",
	"PageDown"
];
var hidden = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	radius: "0px",
	danger: false,
	target: -1,
	visible: false,
	placed: false,
	jump: true,
	first: true
};
var blocked = (element) => element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true" || element.hasAttribute("data-disabled") && element.getAttribute("data-disabled") !== "false";
/** Offsets inside the list, through offsetParent, so open animations (scale, translate) never skew them. */
var offsetIn = (element, list) => {
	let x = 0;
	let y = 0;
	let node = element;
	while (node && node !== list) {
		x += node.offsetLeft;
		y += node.offsetTop;
		const parent = node.offsetParent;
		if (parent && parent !== list && list.contains(parent)) {
			x += parent.clientLeft - parent.scrollLeft;
			y += parent.clientTop - parent.scrollTop;
		}
		node = parent && list.contains(parent) ? parent : null;
	}
	return {
		x,
		y
	};
};
/**
* Two translucent thumbs per list. The hover thumb follows the pointer and the keyboard's active
* row and stays on the last row while the pointer is anywhere in the list. A row whose popover,
* flyout or submenu is open (aria-haspopup with aria-expanded="true" or data-state="open"; a
* wrapping Tooltip overwrites data-state, so aria-expanded is the reliable signal) pins the hover
* thumb until it closes, even after the pointer leaves for the popover. The selection thumb
* rests on the current row and shows only while the hover thumb is hidden. Arrow keys in a field
* outside the list that names it with aria-controls move the hover thumb too. Render it as the list's
* last child; it measures its parent.
*/
function ListHighlight() {
	const self = React.useRef(null);
	const reduced = useReducedMotion();
	const [hover, setHover] = React.useState(hidden);
	const [selection, setSelection] = React.useState(hidden);
	React.useLayoutEffect(() => {
		const list = self.current?.parentElement;
		if (!list) return void 0;
		list.setAttribute("data-list-highlight", "");
		if (getComputedStyle(list).position === "static") list.style.position = "relative";
		const zone = list.closest("[data-radix-popper-content-wrapper]")?.firstElementChild ?? list;
		let hovered = null;
		let keyboard = false;
		let inside = false;
		let frame = 0;
		const own = (element) => element instanceof HTMLElement && element.closest("[data-list-highlight]") === list ? element : null;
		const items = () => [...list.querySelectorAll(LIST_HIGHLIGHT_ITEM)].map(own).filter(Boolean);
		const first = (selector) => items().find((item) => item.matches(selector)) ?? null;
		const measureOne = (target, set) => {
			if (!target || !target.isConnected) {
				set((current) => current.visible ? {
					...current,
					visible: false,
					jump: false
				} : current);
				return;
			}
			const { x, y } = offsetIn(target, list);
			const all = items();
			set((current) => ({
				x,
				y,
				width: target.offsetWidth,
				height: target.offsetHeight,
				radius: getComputedStyle(target).borderRadius,
				danger: target.matches(DANGER),
				target: all.indexOf(target),
				visible: true,
				placed: true,
				jump: !current.placed || !current.visible,
				first: !current.placed
			}));
		};
		const measure = () => {
			frame = 0;
			const current = first(CURRENT) ?? first(HOLDS);
			const expanded = first(EXPANDED);
			let hoverTarget = expanded && !blocked(expanded) ? expanded : null;
			if (!hoverTarget && keyboard) hoverTarget = first(ACTIVE) ?? current;
			else if (!hoverTarget && inside && hovered?.isConnected) hoverTarget = hovered;
			measureOne(hoverTarget, setHover);
			measureOne(hoverTarget ? null : current, setSelection);
		};
		const schedule = () => {
			if (!frame) frame = requestAnimationFrame(measure);
		};
		const over = (event) => {
			if (event.pointerType === "touch") return;
			inside = true;
			const item = own(event.target instanceof Element ? event.target.closest(LIST_HIGHLIGHT_ITEM) : null);
			if (item && !blocked(item)) {
				hovered = item;
				keyboard = false;
			}
			schedule();
		};
		const leave = () => {
			inside = false;
			hovered = null;
			if (!list.contains(document.activeElement)) keyboard = false;
			schedule();
		};
		const controls = (target) => Boolean(list.id) && target instanceof Element && target.getAttribute("aria-controls") === list.id;
		const key = (event) => {
			if (!KEYS.includes(event.key)) return;
			if (!list.contains(document.activeElement) && !list.contains(event.target) && !list.closest(":focus-within") && !controls(event.target)) return;
			keyboard = true;
			schedule();
		};
		const focusOut = (event) => {
			if (event.relatedTarget instanceof Node && list.contains(event.relatedTarget)) return;
			keyboard = false;
			schedule();
		};
		zone.addEventListener("pointerover", over);
		zone.addEventListener("pointerleave", leave);
		list.addEventListener("focusout", focusOut);
		list.addEventListener("animationend", schedule);
		list.addEventListener("transitionend", schedule);
		document.addEventListener("keydown", key, true);
		const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
		const sized = () => [list, ...items()];
		sized().forEach((item) => resize?.observe(item));
		const mutations = new MutationObserver((records) => {
			if (resize && records.some((record) => record.type === "childList")) {
				resize.disconnect();
				sized().forEach((item) => resize.observe(item));
			}
			schedule();
		});
		mutations.observe(list, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [
				"data-highlighted",
				"data-selected",
				"data-active",
				"data-current",
				"aria-current",
				"data-holds-current",
				"data-state",
				"aria-expanded",
				"aria-checked"
			]
		});
		measure();
		return () => {
			cancelAnimationFrame(frame);
			zone.removeEventListener("pointerover", over);
			zone.removeEventListener("pointerleave", leave);
			list.removeEventListener("focusout", focusOut);
			list.removeEventListener("animationend", schedule);
			list.removeEventListener("transitionend", schedule);
			document.removeEventListener("keydown", key, true);
			resize?.disconnect();
			mutations.disconnect();
			list.removeAttribute("data-list-highlight");
		};
	}, []);
	const thumb = (state, kind) => /* @__PURE__ */ jsx(motion.span, {
		"aria-hidden": true,
		"data-slot": "list-highlight",
		"data-thumb": kind,
		"data-visible": state.visible || void 0,
		"data-target": state.target,
		"data-danger": state.danger || void 0,
		initial: false,
		layout: true,
		layoutDependency: `${state.x},${state.y},${state.width},${state.height}`,
		style: {
			left: state.x,
			top: state.y,
			width: state.width,
			height: state.height,
			borderRadius: state.radius
		},
		animate: { opacity: state.visible ? 1 : 0 },
		transition: {
			layout: state.jump || reduced ? snap : spring.moderate,
			opacity: reduced || state.first ? snap : fade.enter
		}
	});
	return /* @__PURE__ */ jsxs("span", {
		ref: self,
		"data-slot": "list-highlight-layer",
		style: { display: "contents" },
		children: [thumb(selection, "selection"), thumb(hover, "hover")]
	});
}
export { LIST_HIGHLIGHT_ITEM, ListHighlight };

//# sourceMappingURL=list-highlight.js.map