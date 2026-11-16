import { useState } from "react";

import { useDiscardChangesGuard } from "@infisical/cipher/hooks/use-discard-changes-guard";
import { DiscardChangesAlertDialog } from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";
import { Checkbox } from "@infisical/cipher/ui/checkbox";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { DataList } from "@infisical/cipher/ui/list";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import * as UI from "@infisical/cipher/ui/sheet";
import { Textarea } from "@infisical/cipher/ui/textarea";

type Alert = { name: string; recipients: string };
const blank = { name: "", recipients: "", breakGlass: true };

const FolderSheet = ({
  label,
  folder,
  accounts,
  initialAlerts,
  initialView = "folder",
  initialDraft = blank
}: {
  label: string;
  folder: string;
  accounts: number;
  initialAlerts: Alert[];
  initialView?: string;
  initialDraft?: typeof blank;
}) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(initialView);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [notes, setNotes] = useState("");
  const [draft, setDraft] = useState(initialDraft);
  const guard = useDiscardChangesGuard({
    isDirty: notes !== "",
    onDiscard: () => {
      setNotes("");
      setOpen(false);
    }
  });
  const openAlert = () => {
    setDraft(blank);
    setView("alert");
  };
  return (
    <>
      <UI.Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            guard.requestDiscard();
            return;
          }
          setView(initialView);
          setDraft(initialDraft);
          setOpen(true);
        }}
      >
        <UI.SheetTrigger asChild>
          <Button variant="outline">{label}</Button>
        </UI.SheetTrigger>
        <UI.SheetContent size="sm">
          <UI.SheetViews view={view} onViewChange={setView}>
            <UI.SheetView
              id="folder"
              title={folder}
              header={
                <UI.SheetHeader>
                  <UI.SheetTitle>{folder}</UI.SheetTitle>
                  <UI.SheetDescription>{accounts} accounts</UI.SheetDescription>
                </UI.SheetHeader>
              }
              footer={
                <UI.SheetFooter>
                  <UI.SheetClose asChild>
                    <Button variant="outline">Done</Button>
                  </UI.SheetClose>
                </UI.SheetFooter>
              }
            >
              <UI.SheetBody>
                <Field label="Notes">
                  <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
                </Field>
                {alerts.length ? (
                  <>
                    <DataList
                      variant="props"
                      items={alerts.map((alert) => [alert.name, alert.recipients] as const)}
                    />
                    <Button variant="outline" icon="bell" onClick={openAlert}>
                      New alert
                    </Button>
                  </>
                ) : (
                  <EmptyState
                    size="sm"
                    icon="bell"
                    title="No alerts on this folder"
                    actions={
                      <Button variant="outline" icon="plus" onClick={openAlert}>
                        New alert
                      </Button>
                    }
                  />
                )}
              </UI.SheetBody>
            </UI.SheetView>
            <UI.SheetView
              id="alert"
              title="New alert"
              badges={
                <DocumentationLink
                  href="https://infisical.com/docs/documentation/platform/pam/alerts"
                  subject="PAM alerts"
                />
              }
              size="lg"
              dirty={
                draft.name !== blank.name ||
                draft.recipients !== blank.recipients ||
                draft.breakGlass !== blank.breakGlass
              }
              discardDescription="This alert hasn't been created."
            >
              <MultiStep
                variant="view"
                completeLabel="Create alert"
                onComplete={() => {
                  setAlerts((current) => [
                    ...current,
                    { name: draft.name, recipients: draft.recipients }
                  ]);
                }}
                steps={[
                  {
                    title: "Trigger",
                    summary: draft.name || undefined,
                    validate: () =>
                      draft.name.trim() ? true : { fields: { name: "Name the alert." } },
                    content: (
                      <>
                        <Field label="Name" name="name">
                          <Input
                            value={draft.name}
                            onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                          />
                        </Field>
                        <Field label="Also alert on break-glass access" orientation="horizontal">
                          <Checkbox
                            checked={draft.breakGlass}
                            onCheckedChange={(value) =>
                              setDraft({ ...draft, breakGlass: value === true })
                            }
                          />
                        </Field>
                      </>
                    )
                  },
                  {
                    title: "Recipients",
                    validate: () =>
                      draft.recipients.trim()
                        ? true
                        : { fields: { recipients: "Add at least one recipient." } },
                    content: (
                      <Field label="Email addresses" name="recipients">
                        <Textarea
                          value={draft.recipients}
                          onChange={(event) =>
                            setDraft({ ...draft, recipients: event.target.value })
                          }
                        />
                      </Field>
                    )
                  }
                ]}
              />
            </UI.SheetView>
          </UI.SheetViews>
        </UI.SheetContent>
      </UI.Sheet>
      <DiscardChangesAlertDialog
        {...guard.discardDialogProps}
        description="Your notes on this folder will be lost."
      />
    </>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <FolderSheet label="Empty folder" folder="staging" accounts={0} initialAlerts={[]} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"No alerts yet"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <FolderSheet
            label="Folder with alerts"
            folder="production-databases"
            accounts={12}
            initialAlerts={[
              { name: "Break-glass on prod", recipients: "oncall@acme.com" },
              { name: "New session", recipients: "dba-team@acme.com" }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"New alert opens as a nested view at lg width"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <FolderSheet
            label="Long names, mid-flow"
            folder="payments-ledger-replication-readwrite-us-east-1-primary"
            accounts={148}
            initialAlerts={[
              {
                name: "Break-glass access to any payments ledger replica during an incident",
                recipients: "payments-oncall@acme.com, security-incident-response@acme.com"
              }
            ]}
            initialView="alert"
            initialDraft={{
              name: "Session opened outside business hours on the ledger replicas",
              recipients: "",
              breakGlass: true
            }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Long breadcrumb, opened on the nested flow"}
        </figcaption>
      </figure>
    </div>
  );
}
