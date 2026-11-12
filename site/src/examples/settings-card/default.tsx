import { useState } from "react";

import * as Confirm from "@infisical/cipher/ui/alert-dialog";
import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";
import { toast } from "@infisical/cipher/ui/sonner";

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

export default function Example() {
  const [saved, setSaved] = useState("payments-api");
  const [name, setName] = useState("payments-api");
  const [deleted, setDeleted] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SettingsCard
            title="Project name"
            description="Shown in the sidebar, the top bar and audit logs."
            dirty={name !== saved}
            hint="Names can use up to 64 characters."
            onDiscard={() => setName(saved)}
            onSave={async () => {
              await wait(800);
              if (!name.trim()) {
                toast.error("Enter a project name, then save again.");
                return;
              }
              setSaved(name);
              toast.success("Project name saved");
            }}
          >
            <Field label="Name">
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
          </SettingsCard>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SettingsCard
            title="Default role"
            description="The role new members get when they join."
            dirty
            saveDisabledReason="Billing is managed by your reseller, so roles can't change here."
            onSave={() => undefined}
          >
            <Field label="Role">
              <Input value="Developer" readOnly />
            </Field>
          </SettingsCard>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Save blocked with a reason"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SettingsCard
            tone="danger"
            title="Leave organization"
            description="You lose access to every project in Acme Corp."
            actions={
              <Button variant="destructive" size="sm">
                Leave Acme Corp
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"No body"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SettingsCard
            title="Audit log retention"
            description="How long audit events are kept."
            action={<Badge>Admins</Badge>}
            locked="Only organization admins can change retention. Ask Sarah Lin."
          >
            <Field label="Days">
              <Input value="90" readOnly />
            </Field>
          </SettingsCard>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Locked for non-admins"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SettingsCard
            tone="danger"
            title="Delete project"
            description="Deletes payments-api with its 412 secrets for everyone. This cannot be undone."
            hint={
              deleted
                ? "Deleted payments-api in this example."
                : "Export secrets first if you need a copy."
            }
            actions={
              <Confirm.AlertDialog>
                <Confirm.AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" disabled={deleted}>
                    Delete project
                  </Button>
                </Confirm.AlertDialogTrigger>
                <Confirm.AlertDialogContent>
                  <Confirm.AlertDialogHeader>
                    <Confirm.AlertDialogTitle>Delete payments-api?</Confirm.AlertDialogTitle>
                    <Confirm.AlertDialogDescription>
                      Its 412 secrets are deleted for everyone.
                    </Confirm.AlertDialogDescription>
                  </Confirm.AlertDialogHeader>
                  <Confirm.AlertDialogFooter>
                    <Confirm.AlertDialogCancel>Cancel</Confirm.AlertDialogCancel>
                    <Confirm.AlertDialogAction asChild>
                      <Button variant="destructive" onClick={() => setDeleted(true)}>
                        Delete payments-api
                      </Button>
                    </Confirm.AlertDialogAction>
                  </Confirm.AlertDialogFooter>
                </Confirm.AlertDialogContent>
              </Confirm.AlertDialog>
            }
          >
            <Field label="Project slug">
              <Input value="payments" readOnly />
            </Field>
          </SettingsCard>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"danger"}</figcaption>
      </figure>
    </div>
  );
}
