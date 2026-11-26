import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const options: SelectOption[] = [
  { value: "dev", label: "Development", meta: "138 secrets", group: "Active" },
  { value: "staging", label: "Staging", meta: "96 secrets", group: "Active" },
  { value: "prod", label: "Production", meta: "212 secrets", group: "Active" },
  { value: "pr-482", label: "pr-482", meta: "Expires Oct 1", group: "Preview" },
  { value: "pr-490", label: "pr-490", meta: "Expired", disabled: true, group: "Preview" }
];
export default function Example() {
  const [value, setValue] = useState("dev");
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Field label="Secret name">
        <Input defaultValue="DATABASE_URL" />
      </Field>
      <Field label="Environment">
        <Select options={options} value={value} onChange={setValue} />
      </Field>
      <p role="status" className="sr-only text-sm">
        Current environment: {value}
      </p>
    </div>
  );
}
