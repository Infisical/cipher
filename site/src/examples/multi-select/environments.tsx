import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { MultiSelect, type MultiSelectOption } from "@infisical/cipher/ui/multi-select";

const options: MultiSelectOption[] = [
  { value: "dev", label: "Development", meta: "138 secrets" },
  { value: "staging", label: "Staging", meta: "96 secrets" },
  { value: "prod", label: "Production", meta: "212 secrets" },
  { value: "pr-482", label: "pr-482", meta: "Expires Oct 1", group: "Preview" },
  { value: "pr-490", label: "pr-490", meta: "Expired", group: "Preview", disabled: true }
];
const many: MultiSelectOption[] = [
  "Development",
  "Staging",
  "Production",
  "QA",
  "Sandbox",
  "Demo",
  "Load test",
  "Canary",
  "EU production",
  "US production",
  "APAC production",
  "Disaster recovery"
].map((label) => ({ value: label.toLowerCase().replace(/\s+/g, "-"), label }));
export default function Example() {
  const [none, setNone] = useState<string[]>([]);
  const [twelve, setTwelve] = useState<string[]>([]);
  const [all, setAll] = useState(["dev", "staging", "prod", "pr-482"]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environments">
            <MultiSelect
              label="Environments"
              placeholder="Choose environments"
              options={options}
              value={none}
              onChange={setNone}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"None selected, Deselect all disabled"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environments">
            <MultiSelect
              label="Environments"
              allLabel="All environments"
              options={options}
              value={all}
              onChange={setAll}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"All selected, Select all disabled"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Environments">
            <MultiSelect
              label="Environments"
              placeholder="Choose environments"
              options={many}
              value={twelve}
              onChange={setTwelve}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Twelve environments, the list scrolls"}
        </figcaption>
      </figure>
    </div>
  );
}
