import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Stack } from "@infisical/cipher/ui/layout";
import * as UI from "@infisical/cipher/ui/sheet";

const scopes = [
  "secrets:read",
  "secrets:write",
  "folders:read",
  "folders:write",
  "imports:read",
  "imports:write",
  "dynamic-secrets:lease",
  "integrations:read",
  "integrations:sync",
  "audit-logs:read",
  "certificates:read",
  "certificates:issue"
];

export default function Example() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState("ci-deployer");
  const [draft, setDraft] = useState(saved);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.Sheet
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) setDraft(saved);
          }}
        >
          <UI.SheetTrigger asChild>
            <Button variant="outline">Edit identity</Button>
          </UI.SheetTrigger>
          <UI.SheetContent size="md">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(draft);
                setOpen(false);
              }}
            >
              <UI.SheetHeader>
                <UI.SheetTitle>Edit identity</UI.SheetTitle>
                <UI.SheetDescription>
                  The form wraps the header, body and footer, so Save submits it without a form id.
                </UI.SheetDescription>
              </UI.SheetHeader>
              <UI.SheetBody>
                <Stack gap={16}>
                  <Field label="Name">
                    <Input
                      required
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                    />
                  </Field>
                  {scopes.map((scope) => (
                    <Field key={scope} label={scope}>
                      <Input readOnly mono value="granted" />
                    </Field>
                  ))}
                </Stack>
              </UI.SheetBody>
              <UI.SheetFooter>
                <Button type="submit">Save identity</Button>
                <UI.SheetClose asChild>
                  <Button variant="outline">Cancel</Button>
                </UI.SheetClose>
              </UI.SheetFooter>
            </form>
          </UI.SheetContent>
        </UI.Sheet>
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Saved name: ${saved}`}</figcaption>
    </figure>
  );
}
