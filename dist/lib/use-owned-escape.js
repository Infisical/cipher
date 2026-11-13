import * as React from "react";
// src/lib/use-owned-escape.ts
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
		const owner = event.target.closest("[data-v4-escape-owner]");
		if (owner && content.current?.contains(owner)) event.preventDefault();
	};
	return {
		ref: attach,
		onEscapeKeyDown: handle
	};
}
export { useOwnedEscape };

//# sourceMappingURL=use-owned-escape.js.map