import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("staging");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.Dialog open={open} onOpenChange={setOpen}>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Edit environment</Button>
          </UI.DialogTrigger>
          <UI.DialogContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              <UI.DialogHeader>
                <UI.DialogTitle>Edit environment</UI.DialogTitle>
                <UI.DialogDescription>Choose the name used in navigation.</UI.DialogDescription>
              </UI.DialogHeader>
              <Field label="Environment name">
                <Input required value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <UI.DialogFooter>
                <UI.DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </UI.DialogClose>
                <Button type="submit">Save changes</Button>
              </UI.DialogFooter>
            </form>
          </UI.DialogContent>
        </UI.Dialog>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Editable form"}</figcaption>
    </figure>
  );
}
