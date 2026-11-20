import * as React from "react";
// src/lib/overlay-pending.ts
var OverlayPendingContext = React.createContext(false);
var useOverlayPending = () => React.useContext(OverlayPendingContext);
var isToastTarget = (target) => target instanceof Element && Boolean(target.closest("[data-sonner-toaster], [data-slot='toast-stack']"));
function useDismissGuard(pending, handlers) {
	const outside = (handler) => (event) => {
		if (pending || isToastTarget(event.target)) {
			event.preventDefault();
			return;
		}
		handler?.(event);
	};
	return {
		onEscapeKeyDown: (event) => {
			if (pending) {
				event.preventDefault();
				return;
			}
			handlers.onEscapeKeyDown(event);
		},
		onPointerDownOutside: outside(handlers.onPointerDownOutside),
		onInteractOutside: outside(handlers.onInteractOutside)
	};
}
export { OverlayPendingContext, useDismissGuard, useOverlayPending };

//# sourceMappingURL=overlay-pending.js.map