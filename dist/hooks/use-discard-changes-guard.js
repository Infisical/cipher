import * as React from "react";
// src/hooks/use-discard-changes-guard.ts
function useDiscardChangesGuard({ isDirty, onDiscard }) {
	const [isDiscardDialogOpen, setIsDiscardDialogOpen] = React.useState(false);
	const requestDiscard = React.useCallback(() => {
		if (isDirty) {
			setIsDiscardDialogOpen(true);
			return;
		}
		onDiscard();
	}, [isDirty, onDiscard]);
	const confirmDiscard = React.useCallback(() => {
		setIsDiscardDialogOpen(false);
		onDiscard();
	}, [onDiscard]);
	return {
		confirmDiscard,
		isDiscardDialogOpen,
		requestDiscard,
		setIsDiscardDialogOpen,
		discardDialogProps: {
			open: isDiscardDialogOpen,
			onOpenChange: setIsDiscardDialogOpen,
			onDiscard: confirmDiscard
		}
	};
}
export { useDiscardChangesGuard };

//# sourceMappingURL=use-discard-changes-guard.js.map