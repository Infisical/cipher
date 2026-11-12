import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as Dialog from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/popover";

function HostnameForm() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("vault.example.test");
  const [draft, setDraft] = useState(saved);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col gap-3">
      <UI.Popover open={open} onOpenChange={setOpen} modal>
        <UI.PopoverAnchor asChild>
          <p>Destination: {saved}</p>
        </UI.PopoverAnchor>
        <UI.PopoverTrigger asChild>
          <Button variant="outline">Edit destination</Button>
        </UI.PopoverTrigger>
        <UI.PopoverContent aria-label="Edit destination hostname">
          <UI.PopoverTitle>Destination hostname</UI.PopoverTitle>
          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim() || draft.includes(" ")) {
                setError("Enter a hostname without spaces.");
                return;
              }
              setSaved(draft);
              setError("");
              setOpen(false);
            }}
          >
            <Field label="Hostname" error={error || undefined}>
              <Input value={draft} onChange={(event) => setDraft(event.target.value)} />
            </Field>
            <Button type="submit">Apply hostname</Button>
          </form>
        </UI.PopoverContent>
      </UI.Popover>
    </div>
  );
}
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <HostnameForm />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Anchored form"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Dialog.Dialog>
            <Dialog.DialogTrigger asChild>
              <Button variant="outline">Edit connection</Button>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent>
              <Dialog.DialogHeader>
                <Dialog.DialogTitle>Connection editor</Dialog.DialogTitle>
                <Dialog.DialogDescription>
                  Changes apply to this local connection only.
                </Dialog.DialogDescription>
              </Dialog.DialogHeader>
              <HostnameForm />
              <Dialog.DialogFooter showCloseButton />
            </Dialog.DialogContent>
          </Dialog.Dialog>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Inside a dialog"}</figcaption>
      </figure>
    </div>
  );
}
