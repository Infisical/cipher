import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";

type Draft = { query: string; complete: (option: ComboboxOption) => void };

const IdentityPicker = ({ initial }: { initial: ComboboxOption[] }) => {
  const [options, setOptions] = useState(initial);
  const [value, setValue] = useState<string>();
  const [draft, setDraft] = useState<Draft>();
  const [name, setName] = useState("");
  const [role, setRole] = useState("Viewer");
  return (
    <Field label="Machine identity">
      <Combobox
        label="Machine identity"
        placeholder="Select an identity"
        options={options}
        value={value}
        onChange={setValue}
        creation={{
          mode: "action",
          label: "Create machine identity",
          onSelect: (next) => {
            setName(next.query);
            setDraft(next);
          }
        }}
      />
      <MultiStep
        variant="dialog"
        title="Create machine identity"
        open={Boolean(draft)}
        onOpenChange={(open) => {
          if (!open) setDraft(undefined);
        }}
        completeLabel="Create identity"
        onComplete={() => {
          const option = { value: name.trim(), label: name.trim(), meta: role };
          setOptions((previous) => [...previous, option]);
          draft?.complete(option);
        }}
        steps={[
          {
            title: "Name",
            summary: name || undefined,
            validate: () => (name.trim() ? true : { fields: { name: "Enter a name." } }),
            content: (
              <Field label="Name" name="name">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
            )
          },
          {
            title: "Role",
            content: (
              <Field label="Project role">
                <Input value={role} onChange={(event) => setRole(event.target.value)} />
              </Field>
            )
          }
        ]}
      />
    </Field>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <IdentityPicker initial={[]} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"No identities yet"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <IdentityPicker
            initial={[
              { value: "ci-deployer", label: "ci-deployer", meta: "Developer" },
              { value: "k8s-operator", label: "k8s-operator", meta: "Viewer" }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Create opens a MultiStep dialog and selects the new identity"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <IdentityPicker
            initial={[
              {
                value: "payments-ledger-replication-readwrite-us-east-1",
                label: "payments-ledger-replication-readwrite-us-east-1",
                meta: "Custom: ledger-replication-operator"
              },
              {
                value: "github-actions-monorepo-release-pipeline-production",
                label: "github-actions-monorepo-release-pipeline-production",
                meta: "Developer"
              }
            ]}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Long identity names"}</figcaption>
      </figure>
    </div>
  );
}
