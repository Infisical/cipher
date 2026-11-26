import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Rule = { id: string; name: string; paths: string[]; note: string; status: string };
const rules: Rule[] = [
  {
    id: "prod",
    name: "Production approvals",
    paths: ["/prod/api/**", "/prod/db/**", "/prod/payments/stripe/**"],
    note: "Two approvers from the platform team before any change to a production secret is applied.",
    status: "Enforced"
  },
  {
    id: "staging",
    name: "Staging review",
    paths: ["/staging/**"],
    note: "One reviewer.",
    status: "Soft"
  },
  {
    id: "rotation-window-for-database-credentials-across-all-regions",
    name: "Rotation window for database credentials across all regions",
    paths: ["/prod/db/**", "/eu/prod/db/**"],
    note: "Rotations run between 02:00 and 04:00 UTC so long-lived connections can drain first.",
    status: "Enforced"
  }
];

const status = (row: Rule) => (
  <Badge tone={row.status === "Enforced" ? "ok" : "soft"} dot={row.status === "Enforced"}>
    {row.status}
  </Badge>
);

const wrapping: DataTableColumn<Rule>[] = [
  { id: "name", header: "Rule", primary: true, maxWidth: 240, text: (row) => row.name },
  { id: "note", header: "Note", grow: true, wrap: true, minWidth: 200, text: (row) => row.note },
  { id: "status", header: "Status", width: 112, render: status }
];

const stacked: DataTableColumn<Rule>[] = [
  { id: "name", header: "Rule", primary: true, valign: "top", text: (row) => row.name },
  {
    id: "paths",
    header: "Paths",
    mono: true,
    render: (row) => (
      <div className="flex flex-col gap-1 py-2.5">
        {row.paths.map((path) => (
          <span key={path}>{path}</span>
        ))}
      </div>
    )
  },
  { id: "status", header: "Status", width: 112, valign: "top", render: status }
];

const actions = {
  inline: [{ label: "Copy name", icon: "copy", onSelect: () => undefined }]
} as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Approval rules"
            rows={rules}
            columns={wrapping}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            selectable
            defaultSelectedIds={["prod"]}
            rowActions={actions}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"A wrapping column top-aligns the whole row, selection and actions included"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Approval rule paths"
            rows={rules}
            columns={stacked}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {'valign="top" beside a column that renders several lines'}
        </figcaption>
      </figure>
    </div>
  );
}
