import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [options, setOptions] = useState<ComboboxOption[]>([
    { value: "web-servers", label: "Web servers" },
    { value: "internal-mtls", label: "Internal mTLS" }
  ]);
  const [values, setValues] = useState(["web-servers"]);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="Certificate profiles">
        <Combobox
          label="Certificate profiles"
          multiple
          options={options}
          value={values}
          onChange={setValues}
          placeholder="Choose profiles"
          creation={{
            mode: "action",
            label: "Create profile",
            onSelect: ({ query, complete }) => {
              const option = {
                value: `profile-${options.length + 1}`,
                label: query || `Profile ${options.length + 1}`
              };
              setOptions((current) => [...current, option]);
              complete(option);
            }
          }}
        />
      </Field>
    </div>
  );
}
