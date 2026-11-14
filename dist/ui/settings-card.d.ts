import * as React from "react";
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
};
export declare function SettingsCard({ title, description, action, dirty, onSave, onDiscard, hint, locked, loading, saveLabel, saveDisabledReason, tone, actions, flush, children, className, ref, ...props }: SettingsCardProps & {
    ref?: React.Ref<HTMLElement>;
}): React.JSX.Element;
export declare namespace SettingsCard {
    var displayName: string;
}
