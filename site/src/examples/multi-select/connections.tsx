import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiSelect, type MultiSelectOption } from "@infisical/cipher/ui/multi-select";
import { MultiStep } from "@infisical/cipher/ui/multi-step";

type Draft = { query: string; complete: (option: MultiSelectOption) => void };

const Logo = ({ letter, color }: { letter: string; color: string }) => (
  <svg viewBox="0 0 16 16" aria-hidden>
    <rect width="16" height="16" fill={color} />
    <text x="8" y="11.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="#fff">
      {letter}
    </text>
  </svg>
);

const LIMIT = 5;

const ConnectionPicker = ({
  initial,
  selected = []
}: {
  initial: MultiSelectOption[];
  selected?: string[];
}) => {
  const [options, setOptions] = useState(initial);
  const [value, setValue] = useState(selected);
  const [draft, setDraft] = useState<Draft>();
  const [name, setName] = useState("");
  return (
    <Field label="Additional context">
      <MultiSelect
        label="Additional context"
        placeholder="Connections the AI can read from"
        searchable
        quickActions={false}
        options={options}
        value={value}
        onChange={setValue}
        createAction={{
          label: "Create Jira connection",
          disabledReason: value.length >= LIMIT ? `Up to ${LIMIT} connections` : undefined,
          onSelect: (next) => {
            setName(next.query);
            setDraft(next);
          }
        }}
      />
      <MultiStep
        variant="dialog"
        title="Create Jira connection"
        open={Boolean(draft)}
        onOpenChange={(open) => {
          if (!open) setDraft(undefined);
        }}
        completeLabel="Create connection"
        onComplete={() => {
          const option = {
            value: name.trim(),
            label: name.trim(),
            media: <Logo letter="J" color="#0c66e4" />
          };
          setOptions((previous) => [...previous, option]);
          draft?.complete(option);
        }}
        steps={[
          {
            title: "Name",
            validate: () => {
              if (!name.trim()) return { fields: { name: "Enter a name." } };
              if (options.some((option) => option.value === name.trim()))
                return { fields: { name: `${name.trim()} already exists.` } };
              return true;
            },
            content: (
              <Field label="Name" name="name">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
            )
          }
        ]}
      />
    </Field>
  );
};

const jira = <Logo letter="J" color="#0c66e4" />;
const slack = <Logo letter="S" color="#611f69" />;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <ConnectionPicker initial={[]} />
        <figcaption className="text-muted-foreground text-xs">{"No connections yet"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <ConnectionPicker
          initial={[
            { value: "jira-support", label: "Jira support desk", media: jira },
            { value: "jira-eng", label: "Jira engineering", media: jira },
            { value: "github", label: "GitHub org", icon: "git" },
            { value: "slack", label: "Slack workspace", media: slack },
            { value: "aws", label: "AWS production", icon: "cloud" }
          ]}
          selected={["jira-support", "github"]}
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Create hands over to a dialog and selects the new connection"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <ConnectionPicker
          initial={[
            {
              value: "jira-payments",
              label: "Jira payments platform incident response (production, EU)",
              media: jira
            },
            {
              value: "jira-ledger",
              label: "Jira ledger replication change management board",
              description: "Read-only lookups for change tickets and their approvers",
              media: jira
            },
            { value: "jira-sec", label: "Jira security operations", media: jira },
            { value: "jira-it", label: "Jira IT service desk", media: jira },
            { value: "github", label: "GitHub enterprise monorepo", icon: "git" },
            {
              value: "slack",
              label: "Slack incident workspace",
              description: "No AI lookups for this app yet",
              media: slack,
              disabled: true
            },
            { value: "aws", label: "AWS production organization", icon: "cloud" },
            { value: "okta", label: "Okta workforce identity", icon: "users" }
          ]}
          selected={["jira-payments", "jira-ledger", "jira-sec", "jira-it", "github"]}
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Long names, a disabled option, and Create blocked at the limit"}
        </figcaption>
      </figure>
    </div>
  );
}
