import { useState } from "react";

import { Combobox } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [values, setValues] = useState(["ops"]);
  return (
    <div className="w-full max-w-sm min-w-0">
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
    </div>
  );
}
