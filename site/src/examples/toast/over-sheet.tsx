import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";
import { toast } from "@infisical/cipher/ui/sonner";

export default function Example() {
  const [saved, setSaved] = useState("30");
  const [draft, setDraft] = useState(saved);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.Sheet>
          <UI.SheetTrigger asChild>
            <Button variant="outline">Edit rotation</Button>
          </UI.SheetTrigger>
          <UI.SheetContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(draft);
                toast.success("Rotation schedule saved", {
                  description: `DATABASE_URL now rotates every ${draft} days.`
                });
              }}
            >
              <UI.SheetHeader>
                <UI.SheetTitle>Rotation schedule</UI.SheetTitle>
                <UI.SheetDescription>The sheet stays open after saving.</UI.SheetDescription>
              </UI.SheetHeader>
              <UI.SheetBody>
                <Field label="Interval in days">
                  <Input
                    required
                    inputMode="numeric"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </Field>
              </UI.SheetBody>
              <UI.SheetFooter>
                <Button type="submit" disabled={draft === saved}>
                  Save schedule
                </Button>
              </UI.SheetFooter>
            </form>
          </UI.SheetContent>
        </UI.Sheet>
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Saved interval: ${saved} days`}</figcaption>
    </figure>
  );
}
