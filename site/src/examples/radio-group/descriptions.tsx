import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@infisical/cipher/ui/radio-group";

const roles = [
  {
    value: "admin",
    label: "Admin",
    description:
      "Manage account templates, folders, and product access control. Access to individual accounts and folders is still granted per-resource."
  },
  {
    value: "member",
    label: "Member",
    description: "Access limited to the folders and accounts they're granted."
  },
  { value: "viewer", label: "Viewer" }
];

export default function Example() {
  const [role, setRole] = useState("admin");
  return (
    <RadioGroup aria-label="Product role" value={role} onValueChange={setRole} className="max-w-sm">
      {roles.map((option) => (
        <RadioGroupItem
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
        />
      ))}
    </RadioGroup>
  );
}
