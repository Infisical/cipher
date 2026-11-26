import { Field } from "@infisical/cipher/ui/field";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const plain: SelectOption[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" }
];
const typical: SelectOption[] = [
  {
    value: "admin",
    label: "Admin",
    meta: "3 members",
    description: "Manages members, roles and billing."
  },
  {
    value: "member",
    label: "Member",
    meta: "48 members",
    description: "Reads and writes secrets in their projects."
  },
  { value: "viewer", label: "Viewer", meta: "12 members", description: "Reads secrets only." }
];
const stressed: SelectOption[] = [
  {
    value: "operator",
    label: "Kubernetes operator secret sync controller service account",
    meta: "12,481 members",
    description:
      "Reads secrets in every production environment and writes rotation results back to the projects it syncs, including ones created by Terraform."
  },
  {
    value: "auditor",
    label: "Compliance auditor with read access to audit logs and access reviews",
    meta: "v2.14.0-rc.3",
    description: "Reads audit logs and access reviews across the organization."
  },
  { value: "member", label: "Member", meta: "48 members" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Role">
            <Select options={plain} placeholder="Choose a role" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Labels only"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Role">
            <Select options={typical} defaultValue="member" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Count as meta, what the role allows below"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Role">
            <Select options={stressed} defaultValue="operator" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Long labels truncate, meta stays, descriptions wrap"}
        </figcaption>
      </figure>
    </div>
  );
}
