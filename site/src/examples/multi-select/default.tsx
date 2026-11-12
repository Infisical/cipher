import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { MultiSelect, type MultiSelectOption } from "@infisical/cipher/ui/multi-select";

const options: MultiSelectOption[] = [
  { value: "read", label: "Read", description: "Fetch existing values", group: "Secrets" },
  { value: "write", label: "Write", description: "Create and edit", group: "Secrets" },
  { value: "delete", label: "Delete", group: "Secrets" },
  { value: "admin", label: "Admin", group: "Project", disabled: true },
  {
    value: "billing",
    label: "Billing",
    description: "Owner only",
    group: "Project",
    disabled: true
  }
];
export default function Example() {
  const [roles, setRoles] = useState(["read", "admin"]);
  const [single, setSingle] = useState<string | null>("read");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Field
        label="Project roles"
        description="Admin is required by policy. Billing is owner only."
      >
        <MultiSelect
          label="Project roles"
          allLabel="All project permissions"
          options={options}
          value={roles}
          onChange={setRoles}
        />
      </Field>
      <Field label="One permission">
        <MultiSelect
          label="One permission"
          multiple={false}
          value={single}
          onChange={setSingle}
          options={options}
        />
      </Field>
      <p role="status" className="sr-only">
        Selected roles:{" "}
        {roles
          .map((role) => options.find((option) => option.value === role)?.label ?? role)
          .join(", ") || "none"}
        . Single permission: {single ?? "none"}.
      </p>
    </div>
  );
}
