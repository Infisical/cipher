import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card } from "./card";
import { Icon } from "./icon";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";

import styles from "./settings-card.module.css";

export type SettingsCardProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "title" | "onSubmit"
> & {
  title: React.ReactNode;
  /** Badges on the title's line, right after its text, such as a plan tier. The card's DocumentationLink goes here too. */
  badges?: React.ReactNode;
  /** One or two sentences about the setting. A frame's head holds only the title, so the description opens the body, above the fields. */
  description?: React.ReactNode;
  /** Controls in the head band, such as a HeaderSearch or a Badge. Buttons there take the 28px band tier, so leave their size unset. */
  action?: React.ReactNode;
  dirty?: boolean;
  onSave?: () => void | Promise<unknown>;
  onDiscard?: () => void;
  /** Status text in the footer band while nothing else is shown there, such as a limit or the last change. */
  hint?: React.ReactNode;
  locked?: React.ReactNode;
  loading?: boolean;
  saveLabel?: string;
  /** Blocks Save and says why, the way Button's disabledReason does: the button stays focusable and shows the reason on hover and focus. */
  saveDisabledReason?: string;
  tone?: "default" | "danger";
  /** The footer band's buttons on a danger card, such as a destructive Button behind a confirmation. */
  actions?: React.ReactNode;
  /** Renders the body edge to edge without the form and footer, for content that is not saved here, such as an embedded DataTable. */
  flush?: boolean;
};

/**
 * One setting, or a few that save together, on the frame primitives: the title in the head band, the fields in the
 * inset, and status with Save, Discard or a danger action in the footer band.
 */
function useSaving(onSave: (() => void | Promise<unknown>) | undefined) {
  const [saving, setSaving] = React.useState(false);
  const save = async () => {
    if (!onSave || saving) return;
    setSaving(true);
    try {
      await onSave();
    } catch {
      // The caller reports the failure with a toast; the card only keeps what was typed.
    } finally {
      setSaving(false);
    }
  };
  return [saving, save] as const;
}

function footerStatus({
  hint,
  locked,
  saving,
  dirty,
}: {
  hint: React.ReactNode;
  locked: React.ReactNode;
  saving: boolean;
  dirty: boolean;
}): React.ReactNode {
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
        <span className={styles.dirtyMark} aria-hidden="true" />
        Unsaved changes
      </>
    );
  return hint;
}

function FooterContent({
  hint,
  locked,
  saving,
  dirty,
  loading,
  tone,
  actions,
  onSave,
  onDiscard,
  saveLabel = "Save",
  saveDisabledReason,
}: Pick<
  SettingsCardProps,
  | "hint"
  | "locked"
  | "tone"
  | "actions"
  | "onSave"
  | "onDiscard"
  | "saveLabel"
  | "saveDisabledReason"
> & { saving: boolean; dirty: boolean; loading: boolean }) {
  const status = footerStatus({ hint, locked, saving, dirty });
  const save = (onSave || (dirty && onDiscard && !saving)) && (
    <SaveButtons
      dirty={dirty}
      saving={saving}
      loading={loading}
      saveLabel={saveLabel}
      saveDisabledReason={saveDisabledReason}
      onSave={onSave}
      onDiscard={onDiscard}
    />
  );
  const buttons = locked ? undefined : tone === "danger" ? actions : save;
  return (
    <>
      <p className={styles.status} role="status">
        {status}
      </p>
      {buttons && <div className={styles.buttons}>{buttons}</div>}
    </>
  );
}

function BodyContent({
  flush,
  description,
  loading,
  disabled,
  children,
}: {
  flush: boolean;
  description: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const lead = description && (
    <p className={cn(styles.description, flush && styles.flushLead)}>
      {description}
    </p>
  );
  const body = loading ? <Skeleton lines={2} height={32} /> : children;
  if (flush)
    return (
      <>
        {lead}
        {body}
      </>
    );
  return (
    <fieldset className={styles.content} disabled={disabled}>
      {lead}
      {body}
    </fieldset>
  );
}

function SaveButtons({
  dirty,
  saving,
  loading,
  saveLabel,
  saveDisabledReason,
  onSave,
  onDiscard,
}: Pick<SettingsCardProps, "onSave" | "onDiscard" | "saveDisabledReason"> & {
  dirty: boolean;
  saving: boolean;
  loading: boolean;
  saveLabel: string;
}) {
  return (
    <>
      {dirty && onDiscard && !saving && (
        <Button type="button" variant="ghost" onClick={onDiscard}>
          Discard
        </Button>
      )}
      {onSave && (
        <Button
          type="submit"
          variant="primary"
          disabled={!saveDisabledReason && (!dirty || loading)}
          disabledReason={saveDisabledReason}
          loading={saving}
        >
          {saveLabel}
        </Button>
      )}
    </>
  );
}

function hasFooterContent(
  {
    hint,
    locked,
    dirty,
    tone,
    actions,
    onSave
  }: Pick<SettingsCardProps, "hint" | "locked" | "dirty" | "tone" | "actions" | "onSave">,
  saving: boolean,
) {
  return Boolean(
    hint || locked || saving || dirty || (tone === "danger" ? actions : onSave),
  );
}

function hasBodyContent({
  description,
  loading,
  children
}: Pick<SettingsCardProps, "description" | "loading" | "children">) {
  return (
    Boolean(description) ||
    Boolean(loading) ||
    React.Children.count(children) > 0
  );
}

function SettingsForm({
  flush,
  onSubmit,
  children,
}: {
  flush: boolean | undefined;
  onSubmit: () => void;
  children: React.ReactElement;
}) {
  if (flush) return children;
  return (
    <form
      noValidate
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {children}
    </form>
  );
}

export function SettingsCard({
  title,
  badges,
  description,
  action,
  dirty,
  onSave,
  onDiscard,
  hint,
  locked,
  loading,
  saveLabel,
  saveDisabledReason,
  tone,
  actions,
  flush,
  children,
  className,
  ref,
  ...props
}: SettingsCardProps & { ref?: React.Ref<HTMLDivElement> }) {
  const titleId = React.useId();
  const [saving, save] = useSaving(
    dirty && !locked && !saveDisabledReason ? onSave : undefined,
  );
  const parts = {
    hint,
    locked,
    dirty,
    tone,
    actions,
    onSave,
    description,
    loading,
    children,
  };
  const hasFooter = !flush && hasFooterContent(parts, saving);
  const hasContent = hasBodyContent(parts);
  return (
    <SettingsForm flush={flush} onSubmit={save}>
      <Card
        ref={ref}
        variant="framed"
        role="region"
        aria-labelledby={titleId}
        data-settings-card=""
        data-tone={tone}
        title={<span id={titleId}>{title}</span>}
        badges={badges}
        action={action}
        footer={
          hasFooter ? (
            <FooterContent
              hint={hint}
              locked={locked}
              saving={saving}
              dirty={Boolean(dirty)}
              loading={Boolean(loading)}
              tone={tone}
              actions={actions}
              onSave={onSave}
              onDiscard={onDiscard}
              saveLabel={saveLabel}
              saveDisabledReason={saveDisabledReason}
            />
          ) : undefined
        }
        footerPlacement="band"
        flush={flush}
        className={cn(styles.card, className)}
        {...props}
      >
        {hasContent ? (
          <BodyContent
            flush={Boolean(flush)}
            description={description}
            loading={Boolean(loading)}
            disabled={Boolean(locked) || saving}
          >
            {children}
          </BodyContent>
        ) : undefined}
      </Card>
    </SettingsForm>
  );
}
SettingsCard.displayName = "SettingsCard";
