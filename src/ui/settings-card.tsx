import * as React from "react";

import { FrameScope } from "../lib/frame-context";
import { cn } from "../lib/utils";
import { EmptyScope } from "./empty";
import { Button } from "./button";
import { Icon } from "./icon";
import { Skeleton } from "./skeleton";
import { toast } from "./sonner";
import { Spinner } from "./spinner";

import styles from "./settings-card.module.css";

export type SettingsCardSaveStatus = "idle" | "saving" | "saved";

export type SettingsCardProps = Omit<
  React.ComponentPropsWithoutRef<"section">,
  "title" | "onSubmit"
> & {
  title: React.ReactNode;
  /** Badges after the title, such as a plan or status. They drop below the title before it wraps. */
  badges?: React.ReactNode;
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

const SAVED_VISIBLE_MS = 2000;

/**
 * Saves one setting as soon as it changes, for cards without a Save button. The value updates at once, goes back
 * to the stored one if onSave throws, and an error toast says what failed. Toggles and selects call save(next);
 * a text field calls edit(next) as the user types, save() on blur or Enter and reset() on Escape.
 */
export function useAutosave<T>({
  value,
  onSave,
  errorMessage
}: {
  value: T;
  onSave: (next: T) => void | Promise<unknown>;
  errorMessage: string;
}) {
  const [draft, setDraft] = React.useState(value);
  const [stored, setStored] = React.useState(value);
  const [status, setStatus] = React.useState<SettingsCardSaveStatus>("idle");
  if (!Object.is(value, stored)) {
    setStored(value);
    setDraft(value);
  }
  React.useEffect(() => {
    if (status !== "saved") return undefined;
    const timer = window.setTimeout(() => setStatus("idle"), SAVED_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [status]);
  const pending = status === "saving";
  const save = async (next: T = draft) => {
    if (pending) return;
    setDraft(next);
    if (Object.is(next, stored)) return;
    setStatus("saving");
    try {
      await onSave(next);
      setStatus("saved");
    } catch {
      setDraft(stored);
      setStatus("idle");
      toast.error(errorMessage);
    }
  };
  return { value: draft, edit: setDraft, save, reset: () => setDraft(stored), status, pending };
}

function SaveStatus({ status }: { status: SettingsCardSaveStatus }) {
  return (
    <span className={styles.saveStatus} data-state={status} role="status">
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.saveLabel}>
        <span className={styles.saveSizer} aria-hidden="true">
          Saving
        </span>
        {status !== "idle" && <span>{status === "saving" ? "Saving" : "Saved"}</span>}
      </span>
    </span>
  );
}

function FooterStatus({
  hint,
  locked,
  saving,
  dirty
}: {
  hint: React.ReactNode;
  locked: React.ReactNode;
  saving: boolean;
  dirty: boolean;
}) {
  if (locked)
    return (
      <>
        <Icon name="lock" size={14} />
        {locked}
      </>
    );
  if (saving)
    return (
      <>
        <Spinner />
        Saving
      </>
    );
  if (dirty)
    return (
      <>
        <span className={cn(styles.mark, styles.dirtyMark)} aria-hidden="true" />
        Unsaved changes
      </>
    );
  return hint;
}

function Footer({
  hint,
  locked,
  saving,
  dirty,
  loading,
  tone,
  actions,
  onSave,
  onDiscard,
  saveLabel,
  saveDisabledReason
}: Pick<
  SettingsCardProps,
  "hint" | "locked" | "tone" | "actions" | "onSave" | "onDiscard" | "saveDisabledReason"
> & { saving: boolean; dirty: boolean; loading: boolean; saveLabel: string }) {
  return (
    <div className={styles.footer}>
      <p className={styles.status} role="status">
        <FooterStatus hint={hint} locked={locked} saving={saving} dirty={dirty} />
      </p>
      {!locked && (
        <div className={styles.buttons}>
          {actions}
          {tone !== "danger" && (
            <>
              {dirty && onDiscard && !saving && (
                <Button type="button" variant="ghost" size="sm" onClick={onDiscard}>
                  Discard
                </Button>
              )}
              {onSave && (
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!saveDisabledReason && (!dirty || loading)}
                  disabledReason={saveDisabledReason}
                  loading={saving}
                >
                  {saveLabel}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function hasFooterContent({
  hint,
  locked,
  dirty,
  saving,
  tone,
  actions,
  onSave,
  onDiscard
}: Pick<SettingsCardProps, "hint" | "locked" | "tone" | "actions" | "onSave" | "onDiscard"> & {
  dirty: boolean;
  saving: boolean;
}) {
  if (tone === "danger") return Boolean(hint || locked || actions);
  return Boolean(hint || locked || actions || dirty || saving || onSave || (dirty && onDiscard));
}

export function SettingsCard({
  title,
  badges,
  description,
  action,
  dirty = false,
  onSave,
  onDiscard,
  hint,
  locked,
  loading = false,
  saveLabel = "Save",
  saveDisabledReason,
  tone = "default",
  actions,
  flush = false,
  saveStatus,
  children,
  className,
  ref,
  ...props
}: SettingsCardProps & { ref?: React.Ref<HTMLElement> }) {
  const [saving, setSaving] = React.useState(false);
  const titleId = React.useId();
  const save = async () => {
    if (!onSave || !dirty || saving || locked || saveDisabledReason) return;
    setSaving(true);
    try {
      await onSave();
    } catch {
      // The caller reports the failure with a toast; the card only keeps what was typed.
    } finally {
      setSaving(false);
    }
  };
  const hasFooter = hasFooterContent({
    hint,
    locked,
    dirty,
    saving,
    tone,
    actions,
    onSave,
    onDiscard
  });
  const header = (
    <div className={styles.header} data-save-status={saveStatus ? "" : undefined}>
      <div className={styles.titleRow}>
        <h3 id={titleId} className={styles.title}>
          {title}
        </h3>
        {badges && <div className={styles.badges}>{badges}</div>}
      </div>
      {saveStatus && <SaveStatus status={saveStatus} />}
      {action && <div className={styles.action}>{action}</div>}
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
  const body = loading ? <Skeleton lines={2} height={32} /> : children;
  const hasBody = loading || React.Children.toArray(children).length > 0;
  if (flush)
    return (
      <section
        ref={ref}
        data-slot="settings-card"
        data-tone={tone}
        data-flush=""
        aria-labelledby={titleId}
        className={cn(styles.card, className)}
        {...props}
      >
        {header}
        {hasBody && (
          <FrameScope framed>
            <EmptyScope size="sm" fill>
              <div className={styles.flushContent}>{body}</div>
            </EmptyScope>
          </FrameScope>
        )}
      </section>
    );
  return (
    <section
      ref={ref}
      data-slot="settings-card"
      data-tone={tone}
      data-footer={hasFooter ? "" : undefined}
      aria-labelledby={titleId}
      className={cn(styles.card, className)}
      {...props}
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        {header}
        {hasBody && (
          <FrameScope framed>
            <EmptyScope size="sm" fill={false}>
              <fieldset className={styles.content} disabled={Boolean(locked) || saving}>
                {body}
              </fieldset>
            </EmptyScope>
          </FrameScope>
        )}
        {hasFooter && (
          <Footer
            hint={hint}
            locked={locked}
            saving={saving}
            dirty={dirty}
            loading={loading}
            tone={tone}
            actions={actions}
            onSave={onSave}
            onDiscard={onDiscard}
            saveLabel={saveLabel}
            saveDisabledReason={saveDisabledReason}
          />
        )}
      </form>
    </section>
  );
}
SettingsCard.displayName = "SettingsCard";
