"use client";
import { cn } from "../lib/utils.js";
import text_module_default from "./text.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/middle-truncate.tsx
var ruler;
var transforms = {
	uppercase: (text) => text.toUpperCase(),
	lowercase: (text) => text.toLowerCase(),
	capitalize: (text) => text.replace(/(^|\s)(\S)/g, (_, space, letter) => space + letter.toUpperCase())
};
function measurerFor(node) {
	if (ruler === void 0) ruler = document.createElement("canvas").getContext("2d");
	const context = ruler;
	if (!context) return null;
	const style = getComputedStyle(node);
	context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
	context.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
	context.wordSpacing = style.wordSpacing === "normal" ? "0px" : style.wordSpacing;
	context.fontKerning = style.fontKerning === "none" ? "none" : "normal";
	const transform = transforms[style.textTransform];
	return (text) => {
		const collapsed = text.replace(/[ \t\n\r\f]+/g, " ");
		return context.measureText(transform ? transform(collapsed) : collapsed).width;
	};
}
function MiddleTruncate({ children, text, keepEnd = 8, mono = false, title, className, onCopy, ref, ...props }) {
	const value = text ?? children ?? "";
	const host = React.useRef(null);
	const [visible, setVisible] = React.useState(value);
	React.useImperativeHandle(ref, () => host.current, []);
	React.useLayoutEffect(() => {
		const node = host.current;
		if (!node) return;
		let alive = true;
		let fitted = -1;
		const fit = (width) => {
			if (!alive || width === fitted) return;
			fitted = width;
			const measure = width ? measurerFor(node) : null;
			if (!measure) {
				setVisible(value);
				return;
			}
			const fits = (candidate) => measure(candidate) <= width;
			if (fits(value)) {
				setVisible(value);
				return;
			}
			const suffixLength = Math.min(Math.max(0, Math.floor(keepEnd)), value.length);
			let start = 0;
			let end = value.length;
			let result = "…";
			while (start <= end) {
				const count = Math.floor((start + end) / 2);
				const suffix = Math.min(suffixLength, count);
				const candidate = `${value.slice(0, count - suffix)}…${suffix ? value.slice(-suffix) : ""}`;
				if (fits(candidate)) {
					result = candidate;
					start = count + 1;
				} else end = count - 1;
			}
			setVisible(result);
		};
		const observer = new ResizeObserver(([entry]) => fit(entry.contentRect.width));
		observer.observe(node);
		const refit = () => {
			const width = fitted;
			fitted = -1;
			if (width >= 0) fit(width);
		};
		document.fonts?.addEventListener("loadingdone", refit);
		return () => {
			alive = false;
			observer.disconnect();
			document.fonts?.removeEventListener("loadingdone", refit);
		};
	}, [value, keepEnd]);
	return /* @__PURE__ */ jsxs("span", {
		ref: host,
		"data-slot": "middle-truncate",
		className: cn(text_module_default.truncate, mono && text_module_default.mono, className),
		title: title === false ? void 0 : title ?? value,
		onCopy: (event) => {
			onCopy?.(event);
			if (!event.defaultPrevented) {
				event.clipboardData.setData("text/plain", value);
				event.preventDefault();
			}
		},
		...props,
		children: [/* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: value
		}), /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			children: visible
		})]
	});
}
MiddleTruncate.displayName = "MiddleTruncate";
export { MiddleTruncate };

//# sourceMappingURL=middle-truncate.js.map