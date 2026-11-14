import { useCallback, useEffect, useLayoutEffect, useState } from "react";
// src/lib/use-flow-transition.ts
var useFlowTransition = (index) => {
	const [reduced, setReduced] = useState(() => typeof window !== "undefined" && Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches));
	const [height, setHeight] = useState();
	const [ready, setReady] = useState(false);
	const [node, setNode] = useState(null);
	const [travel, setTravel] = useState({
		index,
		direction: "forward"
	});
	const [intended, setIntended] = useState();
	if (travel.index !== index) {
		setTravel({
			index,
			direction: intended ?? (index > travel.index ? "forward" : "back")
		});
		setIntended(void 0);
	}
	useEffect(() => {
		const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
		const change = () => setReduced(Boolean(query?.matches));
		query?.addEventListener("change", change);
		return () => query?.removeEventListener("change", change);
	}, []);
	const measure = useCallback((element) => setNode(element), []);
	useLayoutEffect(() => {
		if (!node) return void 0;
		const update = () => {
			if (node.offsetHeight > 0) setHeight(node.offsetHeight);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(node);
		const frame = typeof requestAnimationFrame === "function" ? requestAnimationFrame(() => setReady(true)) : void 0;
		if (frame === void 0) setReady(true);
		return () => {
			observer.disconnect();
			if (frame !== void 0) cancelAnimationFrame(frame);
		};
	}, [node]);
	let style = {};
	if (reduced) style = { transition: "none" };
	else if (height !== void 0) style = { height };
	return {
		measure,
		style,
		ready,
		reduced,
		direction: travel.direction,
		intend: setIntended
	};
};
export { useFlowTransition };

//# sourceMappingURL=use-flow-transition.js.map