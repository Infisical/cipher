"use client";
import { cn, titleIfClamped } from "../lib/utils.js";
import name_line_module_default from "./name-line.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/name-line.tsx
/** One line of media, name, badges and trailing content. Under pressure the badges give way first (use Badge collapse), then a long name truncates to a 12ch floor, then each badge that no longer fits hides whole; the trailing content always stays whole. The full name shows on hover, or title when given, such as an unabbreviated value. */
function NameLine({ media, badges, trailing, children, className, ref, ...props }) {
	const nameRef = React.useRef(null);
	const mainRef = React.useRef(null);
	const badgesRef = React.useRef(null);
	const hasBadges = Boolean(badges);
	React.useLayoutEffect(() => {
		const main = mainRef.current;
		const group = badgesRef.current;
		const name = nameRef.current;
		if (!main || !group || !name) return;
		const fit = () => {
			const edge = main.getBoundingClientRect();
			for (const badge of Array.from(group.children)) {
				const box = badge.getBoundingClientRect();
				badge.toggleAttribute("data-clipped", box.right > edge.right + .5 || box.left < edge.left - .5);
			}
		};
		fit();
		const resize = new ResizeObserver(fit);
		resize.observe(main);
		resize.observe(name);
		const mutation = new MutationObserver(fit);
		mutation.observe(main, {
			subtree: true,
			childList: true,
			characterData: true
		});
		return () => {
			resize.disconnect();
			mutation.disconnect();
		};
	}, [hasBadges]);
	React.useLayoutEffect(() => {
		const name = nameRef.current;
		if (!name) return;
		const measure = () => {
			if ((name.textContent ?? "").length > 12) name.setAttribute("data-floor", "");
			else name.removeAttribute("data-floor");
		};
		measure();
		const observer = new MutationObserver(measure);
		observer.observe(name, {
			subtree: true,
			childList: true,
			characterData: true
		});
		return () => observer.disconnect();
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		ref,
		"data-slot": "name-line",
		className: cn(name_line_module_default.line, className),
		...props,
		children: [/* @__PURE__ */ jsxs("span", {
			ref: mainRef,
			className: name_line_module_default.main,
			children: [
				media && /* @__PURE__ */ jsx("span", {
					"data-slot": "name-line-media",
					className: name_line_module_default.media,
					children: media
				}),
				/* @__PURE__ */ jsx("span", {
					"data-slot": "name-line-name",
					ref: nameRef,
					className: name_line_module_default.name,
					onPointerEnter: props.title === void 0 ? (event) => titleIfClamped(event.currentTarget) : void 0,
					children
				}),
				badges && /* @__PURE__ */ jsx("span", {
					ref: badgesRef,
					"data-slot": "name-line-badges",
					className: name_line_module_default.badges,
					children: badges
				})
			]
		}), trailing && /* @__PURE__ */ jsx("span", {
			"data-slot": "name-line-trailing",
			className: name_line_module_default.trailing,
			children: trailing
		})]
	});
}
NameLine.displayName = "NameLine";
export { NameLine };

//# sourceMappingURL=name-line.js.map