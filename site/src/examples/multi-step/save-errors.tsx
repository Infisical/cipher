import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep, type MultiStepResult } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const taken = ["production-readonly"];

const save = async (name: string, role: string): Promise<MultiStepResult> => {
  await new Promise((resolve) => {
    setTimeout(resolve, 600);
  });
  const fields = {
    role: role === "Owner" ? "Machine identities can't be owners. Pick another role." : undefined,
    name: taken.includes(name.trim())
      ? `An identity named ${name.trim()} already exists. Pick another name.`
      : undefined
  };
  if (fields.role || fields.name) return { fields };
  if (name.length > 40)
    return { message: "The server rejected the request. Try again in a minute." };
  toast(`Created ${name}.`);
  return undefined;
};

const CreateIdentity = ({
  initial,
  initialRole = "Viewer"
}: {
  initial: string;
  initialRole?: string;
}) => {
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState(initial);
  return (
    <MultiStep
      variant="page"
      title="Create machine identity"
      defaultStep={1}
      completeLabel="Create identity"
      onComplete={() => save(name, role)}
      steps={[
        {
          title: "Role",
          summary: role,
          content: (
            <Field label="Role" name="role">
              <Input value={role} onChange={(event) => setRole(event.target.value)} />
            </Field>
          )
        },
        {
          title: "Name",
          heading: "Name the identity",
          content: (
            <Field label="Name" name="name">
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
          )
        }
      ]}
    />
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CreateIdentity initial="production-readonly" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Save returns a field error, which lands on Name"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CreateIdentity initial="payments-ledger-replication-readwrite-us-east-1-primary" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"A long name, and a save error with no field"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <CreateIdentity initial="production-readonly" initialRole="Owner" />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Errors on two steps: Save goes back to Role, and Name shows its own once reached"}
        </figcaption>
      </figure>
    </div>
  );
}
