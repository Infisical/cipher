import { Field } from "@infisical/cipher/ui/field";
import { Select } from "@infisical/cipher/ui/select";

const roles = [
  {
    value: "admin",
    label: "Admin",
    description: "Full access to every project, member, setting and billing detail."
  },
  {
    value: "member",
    label: "Member",
    description:
      "Reads and writes secrets in the projects they belong to, and can create new projects."
  },
  {
    value: "viewer",
    label: "Viewer",
    description: "Reads secrets and settings. Cannot change anything."
  },
  {
    value: "no-access",
    label: "No access",
    description: "Signs in, but sees no projects until a role grants them."
  }
];

export default function Example() {
  return (
    <div className="w-full max-w-sm min-w-0">
      <Field label="Role">
        <Select label="Role" options={roles} defaultValue="member" />
      </Field>
    </div>
  );
}
