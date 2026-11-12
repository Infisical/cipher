import { useEffect, useId, useState } from "react";

import { useDiscardChangesGuard } from "@infisical/cipher/hooks/use-discard-changes-guard";
import { DiscardChangesAlertDialog } from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";

export default function Example() {
  const [saved, setSaved] = useState("https://hooks.example.com/infisical");
  const [draft, setDraft] = useState(saved);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const formId = useId();
  const { requestDiscard, discardDialogProps } = useDiscardChangesGuard({
    isDirty: draft !== saved,
    onDiscard: () => {
      setDraft(saved);
      setOpen(false);
    }
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
        <UI.Sheet open={open} onOpenChange={(next) => (next ? setOpen(true) : requestDiscard())}>
          <UI.SheetTrigger asChild>
            <Button variant="outline">Edit webhook</Button>
          </UI.SheetTrigger>
          <UI.SheetContent pending={saving}>
            <UI.SheetHeader>
              <UI.SheetTitle>Edit webhook</UI.SheetTitle>
              <UI.SheetDescription>
                Closing with unsaved edits asks first. While saving, the sheet cannot close.
              </UI.SheetDescription>
            </UI.SheetHeader>
            <UI.SheetBody>
              <form
                id={formId}
                onSubmit={(event) => {
                  event.preventDefault();
                  setSaving(true);
                }}
              >
                <Field label="Endpoint URL">
                  <Input
                    required
                    mono
                    disabled={saving}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </Field>
              </form>
            </UI.SheetBody>
            <UI.SheetFooter>
              <Button type="submit" form={formId} loading={saving} disabled={draft === saved}>
                Save Changes
              </Button>
              <UI.SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </UI.SheetClose>
            </UI.SheetFooter>
          </UI.SheetContent>
        </UI.Sheet>
        <DiscardChangesAlertDialog
          {...discardDialogProps}
          description="Your unsaved changes to this webhook will be lost."
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Saved URL: ${saved}`}</figcaption>
    </figure>
  );
}
