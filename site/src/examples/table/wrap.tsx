import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Policy = { id: string; name: string; scope: string; description: string; status: string };
const policies: Policy[] = [
  {
    id: "prod-approvals",
    name: "Production secret changes need two approvers from the platform team",
    scope: "prod / **",
    description:
      "Any change to a secret under the production environment waits for two approvals from the platform team before it is applied.",
    status: "Enforced"
  },
  {
    id: "staging-review",
    name: "Staging review",
    scope: "staging / api",
    description: "One reviewer from the API team.",
    status: "Soft"
  },
  {
    id: "rotation-window",
    name: "Rotation window for database credentials across all regions",
    scope: "prod / db",
    description:
      "Rotations run between 02:00 and 04:00 UTC so long-lived connections can drain before the old credential is revoked.",
    status: "Enforced"
  }
];

const status = (row: Policy) => (
  <Badge tone={row.status === "Enforced" ? "ok" : "soft"} dot={row.status === "Enforced"}>
    {row.status}
  </Badge>
);

const wrapped: DataTableColumn<Policy>[] = [
  { id: "name", header: "Policy", primary: true, width: 220, render: (row) => row.name },
  { id: "description", header: "Description", grow: true, wrap: true, render: (row) => row.description },
  { id: "status", header: "Status", width: 120, render: status }
];

const shrinking: DataTableColumn<Policy>[] = [
  { id: "name", header: "Policy", primary: true, text: (row) => row.name, render: (row) => row.name },
  { id: "scope", header: "Scope", mono: true, render: (row) => row.scope },
  { id: "status", header: "Status", render: status }
];

const actions = {
  inline: [
    { label: "Duplicate", icon: "copy", onSelect: () => undefined },
    { label: "Delete", icon: "trash", onSelect: () => undefined }
  ]
} as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Approval policies"
            rows={policies}
            columns={wrapped}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"wrap on Description: long text wraps and the row grows; Policy still truncates"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 max-w-[560px] flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Approval policies, narrow"
            rows={policies}
            columns={shrinking}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            rowActions={actions}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Pinned actions: the primary column truncates before the table scrolls sideways"}
        </figcaption>
      </figure>
    </div>
  );
}
