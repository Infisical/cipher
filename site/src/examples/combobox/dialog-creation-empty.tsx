import { useState } from "react";

import {
  Combobox,
  type ComboboxCreation,
  type ComboboxOption
} from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [options, setOptions] = useState<ComboboxOption[]>([]);
  const [value, setValue] = useState("");
  const creation: ComboboxCreation = {
    mode: "dialog",
    label: "Create connection",
    title: "Create AWS connection",
    submitLabel: "Create connection",
    renderForm: ({ formId, complete }) => (
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          const name = String(new FormData(event.currentTarget).get("name")).trim();
          if (!name) return;
          const option = { value: name, label: name, meta: "Access key" };
          setOptions((previous) => [...previous, option]);
          complete(option);
        }}
      >
        <Field label="Name">
          <Input name="name" autoComplete="off" required />
        </Field>
      </form>
    )
  };
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Field label="AWS connection">
          <Combobox
            label="AWS connection"
            placeholder="Select a connection"
            options={options}
            value={value}
            onChange={setValue}
            emptyText="No AWS connections yet"
            creation={creation}
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"With no options yet, the menu shows the empty text and a Create button"}
      </figcaption>
    </figure>
  );
}
