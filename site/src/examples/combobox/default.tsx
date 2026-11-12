import { useState } from "react";

import { Combobox } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [value, setValue] = useState("dev");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="Single environment" description="Creation is unavailable.">
        <Combobox
          label="Single environment"
          options={[
            { value: "dev", label: "Dev", meta: "3 projects" },
            { value: "prod", label: "Prod", meta: "12 projects" },
            { value: "archived", label: "Archived", disabled: true }
          ]}
          value={value}
          onChange={setValue}
          clearable
          placeholder="Choose"
        />
      </Field>
      <p role="status" className="sr-only text-sm">
        Selected environment: {value || "none"}
      </p>
    </div>
  );
}
