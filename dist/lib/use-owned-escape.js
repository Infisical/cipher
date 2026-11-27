import * as React from "react";
// src/lib/use-owned-escape.ts
var owned = /* @__PURE__ */ new WeakSet();
/** True when an overlay kept this Escape open for an escape owner inside it, so the owner still acts on the prevented event. */
var isOwnedEscape = (event) => owned.has(event);
function useOwnedEscape(ref, onEscapeKeyDown) {
	const content = React.useRef(null);
	const attach = React.useCallback((node) => {
		content.current = node;
		if (typeof ref === "function") ref(node);
		else if (ref) ref.current = node;
	}, [ref]);
	const handle = (event) => {
		onEscapeKeyDown?.(event);
		if (event.defaultPrevented || !(event.target instanceof Element)) return;
		const owner = event.target.closest("[data-cipher-escape-owner]");
		if (!owner || !content.current?.contains(owner)) return;
		event.preventDefault();
		owned.add(event);
	};
	return {
		ref: attach,
		onEscapeKeyDown: handle
	};
}
export { isOwnedEscape, useOwnedEscape };

//# sourceMappingURL=use-owned-escape.js.map