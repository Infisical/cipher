import { cn } from "../lib/utils.js";
import text_module_default from "./text.module.js";
import * as React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
// src/ui/middle-truncate.tsx
function MiddleTruncate({ children, text, keepEnd = 8, mono = false, title, className, onCopy, ref, ...props }) {
	const value = text ?? children ?? "";
	const host = React.useRef(null);
	const measure = React.useRef(null);
	const [visible, setVisible] = React.useState(value);
	React.useImperativeHandle(ref, () => host.current, []);
	React.useLayoutEffect(() => {
		const node = host.current;
		const ruler = measure.current;
		if (!node || !ruler) return;
		let alive = true;
		const fit = () => {
			if (!alive) return;
			const width = node.clientWidth;
			if (!width) {
				setVisible(value);
				return;
			}
			const fits = (candidate) => {
				ruler.textContent = candidate;
				return ruler.offsetWidth <= width;
			};
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
		fit();
		const observer = new ResizeObserver(fit);
		observer.observe(node);
		document.fonts?.ready.then(fit).catch(() => void 0);
		return () => {
			alive = false;
			observer.disconnect();
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
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "sr-only",
				children: value
			}),
			/* @__PURE__ */ jsx("span", {
				"aria-hidden": "true",
				children: visible
			}),
			/* @__PURE__ */ jsx("span", {
				ref: measure,
				"aria-hidden": "true",
				className: text_module_default.measure
			})
		]
	});
}
MiddleTruncate.displayName = "MiddleTruncate";
export { MiddleTruncate };

//# sourceMappingURL=middle-truncate.js.map