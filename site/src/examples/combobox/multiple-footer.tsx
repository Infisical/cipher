import { useState } from "react";

import { Combobox, ComboboxFooterAction } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";
import { Meta } from "@infisical/cipher/ui/text";

const environments = [
  { value: "dev", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "prod", label: "Production" }
];

export default function Example() {
  const [values, setValues] = useState(["ops"]);
  const [environment, setEnvironment] = useState("prod");
  const [targets, setTargets] = useState(["staging"]);
  return (
    <div className="flex w-full max-w-sm min-w-0 flex-col gap-6">
      <Field label="Reviewers">
        <Combobox
          label="Reviewers"
          multiple
          options={[
            { value: "ops", label: "Ops on-call" },
            { value: "security", label: "Security" },
            { value: "platform", label: "Platform" }
          ]}
          value={values}
          onChange={setValues}
          placeholder="Choose reviewers"
          emptyText="No reviewer group matches."
          footer="Only groups with project access are listed"
        />
      </Field>
      <Field label="Environment">
        <Combobox
          label="Environment"
          options={environments}
          value={environment}
          onChange={setEnvironment}
          placeholder="Choose an environment"
          footer={<ComboboxFooterAction icon="plus">Add environment</ComboboxFooterAction>}
        />
      </Field>
      <Field label="Sync targets">
        <Combobox
          label="Sync targets"
          multiple
          options={environments}
          value={targets}
          onChange={setTargets}
          placeholder="Choose environments"
          footer={
            <>
              <ComboboxFooterAction icon="plus">Add environment</ComboboxFooterAction>
              <p className="px-2 py-1">
                <Meta mono={false}>Targets sync every 15 minutes.</Meta>
              </p>
            </>
          }
        />
      </Field>
    </div>
  );
}
