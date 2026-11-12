import { useEffect, useId, useState } from "react";

import { useDiscardChangesGuard } from "@infisical/cipher/hooks/use-discard-changes-guard";
import { DiscardChangesAlertDialog } from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [saved, setSaved] = useState("staging");
  const [draft, setDraft] = useState(saved);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const formId = useId();
  const close = () => {
    setDraft(saved);
    setOpen(false);
  };
  const { requestDiscard, discardDialogProps } = useDiscardChangesGuard({
    isDirty: draft !== saved,
    onDiscard: close
  });
  useEffect(() => {
    if (!saving) return undefined;
    const timer = window.setTimeout(() => {
      setSaved(draft);
      setSaving(false);
      setOpen(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [saving, draft]);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : requestDiscard())}>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Rename environment</Button>
          </UI.DialogTrigger>
          <UI.DialogContent pending={saving}>
            <UI.DialogHeader>
              <UI.DialogTitle>Rename environment</UI.DialogTitle>
              <UI.DialogDescription>
                Closing with unsaved edits asks first. While saving, the dialog cannot close.
              </UI.DialogDescription>
            </UI.DialogHeader>
            <form
              id={formId}
              onSubmit={(event) => {
                event.preventDefault();
                setSaving(true);
              }}
            >
              <Field label="Environment name">
                <Input
                  required
                  disabled={saving}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </Field>
            </form>
            <UI.DialogFooter>
              <UI.DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </UI.DialogClose>
              <Button type="submit" form={formId} loading={saving} disabled={draft === saved}>
                Save Changes
              </Button>
            </UI.DialogFooter>
          </UI.DialogContent>
        </UI.Dialog>
        <DiscardChangesAlertDialog
          {...discardDialogProps}
          description="Your unsaved changes to this environment will be lost."
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Saved name: ${saved}`}</figcaption>
    </figure>
  );
}
