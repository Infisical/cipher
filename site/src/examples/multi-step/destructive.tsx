import { useState } from "react";

import { Checkbox } from "@infisical/cipher/ui/checkbox";
import { Field } from "@infisical/cipher/ui/field";
import { MultiStep, type MultiStepStep } from "@infisical/cipher/ui/multi-step";
import { Textarea } from "@infisical/cipher/ui/textarea";
import { toast } from "@infisical/cipher/ui/sonner";

const useBreakGlass = (account: string, reason: string): MultiStepStep[] => {
  const [confirmed, setConfirmed] = useState(Boolean(reason));
  const [justification, setJustification] = useState(reason);
  return [
    { title: "Account", summary: account, content: <p>{account}</p> },
    {
      title: "Reason",
      summary: justification || undefined,
      content: (
        <Field label="Justification">
          <Textarea
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
          />
        </Field>
      )
    },
    {
      title: "Break glass",
      heading: "Skip approval and open access now",
      description: "Approvers are notified, and the session is recorded and flagged for review.",
      completeVariant: "destructive",
      completeIcon: "zap",
      disabledReason: confirmed ? undefined : "Confirm that you are bypassing approval.",
      content: (
        <Field label="I am bypassing approval for an emergency" orientation="horizontal">
          <Checkbox checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)} />
        </Field>
      )
    }
  ];
};

const BreakGlass = ({
  account,
  reason,
  label
}: {
  account: string;
  reason: string;
  label: string;
}) => (
  <MultiStep
    variant="page"
    title="Request access"
    steps={useBreakGlass(account, reason)}
    defaultStep={2}
    completeLabel={label}
    onComplete={() => {
      toast("Access opened without approval.");
    }}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <BreakGlass account="prod-postgres" reason="" label="Break glass" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Destructive final action, blocked until confirmed"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <BreakGlass
            account="prod-postgres-primary-us-east-1-payments-ledger-readwrite"
            reason="Payments ledger replication is stalled and on-call approvers are unreachable during the incident bridge."
            label="Break glass and open the session now"
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Confirmed, with a long account and label"}
        </figcaption>
      </figure>
    </div>
  );
}
