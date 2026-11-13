import { useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const plans: ComboboxOption[] = [
  { value: "free", label: "Free", description: "Up to 5 identities", group: "Self-serve" },
  { value: "pro", label: "Pro", description: "Audit logs and SSO", group: "Self-serve" },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "SCIM, approvals and dedicated support",
    group: "Sales-led"
  },
  {
    value: "enterprise-trial",
    label: "Enterprise trial",
    description: "30 days, converts to Pro",
    meta: "Trial",
    group: "Sales-led"
  },
  {
    value: "legacy",
    label: "Team (legacy)",
    description: "No longer sold",
    group: "Archived",
    disabled: true
  }
];

export default function Example() {
  const [plan, setPlan] = useState("pro");
  const [addons, setAddons] = useState<string[]>(["enterprise"]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <Field label="Plan" description="Search matches descriptions too, such as SSO.">
        <Combobox label="Plan" options={plans} value={plan} onChange={setPlan} />
      </Field>
      <Field label="Compare plans">
        <Combobox
          multiple
          label="Compare plans"
          options={plans}
          value={addons}
          onChange={setAddons}
        />
      </Field>
      <p role="status" className="sr-only">
        Plan: {plan || "none"}. Comparing: {addons.join(", ") || "none"}.
      </p>
    </div>
  );
}
