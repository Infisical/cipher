import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

export default function Example() {
  const [options, setOptions] = useState<ComboboxOption[]>([
    { value: "dev", label: "Dev" },
    { value: "prod", label: "Prod" },
    { value: "archived", label: "Archived", disabled: true }
  ]);
  const [value, setValue] = useState("dev");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Field label="Environment">
          <Combobox
            label="Environment"
            options={options}
            value={value}
            onChange={setValue}
            createLabel={(query) => `Create environment "${query}"`}
            onCreate={async (query, { signal }) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
              if (signal.aborted) return;
              setOptions((previous) => [...previous, { value: query, label: query }]);
              setValue(query);
            }}
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Search and create, with a custom Create label"}
      </figcaption>
    </figure>
  );
}
