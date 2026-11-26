import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { toast } from "@infisical/cipher/ui/sonner";

export default function Example() {
  const [saved, setSaved] = useState("staging");
  const [draft, setDraft] = useState(saved);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.Dialog>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Rename environment</Button>
          </UI.DialogTrigger>
          <UI.DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(draft);
                toast.success("Environment renamed", {
                  description: `Navigation now shows ${draft}.`
                });
              }}
            >
              <UI.DialogHeader>
                <UI.DialogTitle>Rename environment</UI.DialogTitle>
                <UI.DialogDescription>The dialog stays open after saving.</UI.DialogDescription>
              </UI.DialogHeader>
              <Field label="Environment name">
                <Input required value={draft} onChange={(event) => setDraft(event.target.value)} />
              </Field>
              <UI.DialogFooter>
                <UI.DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </UI.DialogClose>
                <Button type="submit" disabled={draft === saved}>
                  Save name
                </Button>
              </UI.DialogFooter>
            </form>
          </UI.DialogContent>
        </UI.Dialog>
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Saved name: ${saved}`}</figcaption>
    </figure>
  );
}
