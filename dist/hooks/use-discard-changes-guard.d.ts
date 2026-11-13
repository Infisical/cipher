import * as React from "react";
export declare function useDiscardChangesGuard({ isDirty, onDiscard }: {
    isDirty: boolean;
    onDiscard: () => void;
}): {
    confirmDiscard: () => void;
    isDiscardDialogOpen: boolean;
    requestDiscard: () => void;
    setIsDiscardDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    discardDialogProps: {
        open: boolean;
        onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
        onDiscard: () => void;
    };
};
