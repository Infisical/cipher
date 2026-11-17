import * as React from "react";
export type SettingsCardSaveStatus = "idle" | "saving" | "saved";
export type SettingsCardProps = Omit<React.ComponentPropsWithoutRef<"section">, "title" | "onSubmit"> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    dirty?: boolean;
    onSave?: () => void | Promise<unknown>;
    onDiscard?: () => void;
    hint?: React.ReactNode;
    locked?: React.ReactNode;
    loading?: boolean;
    saveLabel?: string;
    /** Blocks Save and says why, the way Button's disabledReason does: the button stays focusable and shows the reason on hover and focus. */
    saveDisabledReason?: string;
    tone?: "default" | "danger";
    actions?: React.ReactNode;
    /** Renders the body edge to edge without the form and footer, for content that is not saved here, such as an embedded DataTable. */
    flush?: boolean;
    /** Progress of a change that saves on its own, shown beside the title. Pass the status from useAutosave. */
    saveStatus?: SettingsCardSaveStatus;
};
/**
 * Saves one setting as soon as it changes, for cards without a Save button. The value updates at once, goes back
 * to the stored one if onSave throws, and an error toast says what failed. Toggles and selects call save(next);
 * a text field calls edit(next) as the user types, save() on blur or Enter and reset() on Escape.
 */
export declare function useAutosave<T>({ value, onSave, errorMessage }: {
    value: T;
    onSave: (next: T) => void | Promise<unknown>;
    errorMessage: string;
}): {
    value: T;
    edit: React.Dispatch<React.SetStateAction<T>>;
    save: (next?: T) => Promise<void>;
    reset: () => void;
    status: SettingsCardSaveStatus;
    pending: boolean;
};
export declare function SettingsCard({ title, description, action, dirty, onSave, onDiscard, hint, locked, loading, saveLabel, saveDisabledReason, tone, actions, flush, saveStatus, children, className, ref, ...props }: SettingsCardProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace SettingsCard {
    var displayName: string;
}
