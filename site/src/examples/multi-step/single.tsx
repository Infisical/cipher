import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep, type MultiStepStep } from "@infisical/cipher/ui/multi-step";
import { Textarea } from "@infisical/cipher/ui/textarea";
import { toast } from "@infisical/cipher/ui/sonner";

const useSecretForm = (initialKey: string, initialNote: string): MultiStepStep[] => {
  const [key, setKey] = useState(initialKey);
  const [note, setNote] = useState(initialNote);
  return [
    {
      title: "Secret",
      heading: "Add a secret",
      validate: () => (key.trim() ? true : { fields: { key: "Enter a key." } }),
      content: (
        <>
          <Field label="Key" name="key">
            <Input value={key} onChange={(event) => setKey(event.target.value)} />
          </Field>
          <Field label="Comment">
            <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
        </>
      )
    }
  ];
};

const SecretPage = ({ secretKey, note }: { secretKey: string; note: string }) => (
  <MultiStep
    variant="page"
    steps={useSecretForm(secretKey, note)}
    completeLabel="Add secret"
    onComplete={() => {
      toast("Secret added.");
    }}
  />
);

const SecretDialog = () => (
  <MultiStep
    variant="dialog"
    title="Add a secret"
    steps={useSecretForm("STRIPE_WEBHOOK_SECRET", "")}
    completeLabel="Add secret"
    trigger={<Button variant="outline">Add secret</Button>}
    onComplete={() => {
      toast("Secret added.");
    }}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <SecretDialog />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"One step in a dialog: no step count or progress bar"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SecretPage
            secretKey="PAYMENTS_LEDGER_REPLICATION_READWRITE_DATABASE_CONNECTION_STRING_US_EAST_1"
            note="Rotated by the payments on-call rotation after every incident bridge that touches the ledger replicas."
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"One step on a page, with a long key and comment"}
        </figcaption>
      </figure>
    </div>
  );
}
