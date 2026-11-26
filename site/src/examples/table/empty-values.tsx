import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Row = { id: string; name: string; expires?: string; lastUsed?: string };

const rows: Row[] = [
  { id: "a", name: "ci-deploy", expires: "Dec 31, 2026", lastUsed: "2 hours ago" },
  { id: "b", name: "local-dev" },
  {
    id: "c",
    name: "payments-settlement-reconciliation-worker-production-eu-central",
    lastUsed: "Yesterday"
  },
  { id: "d", name: "terraform-plan", expires: "Jan 15, 2027" }
];

const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", primary: true, grow: true, mono: true, text: (row) => row.name },
  { id: "expires", header: "Expires", width: 112, render: (row) => row.expires },
  {
    id: "last-used",
    header: "Last used",
    width: 128,
    dropFirst: true,
    render: (row) => row.lastUsed
  }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <DataTable
        label="Access tokens"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
      />
      <figcaption className="text-muted-foreground text-xs">
        {"A cell with no value, such as a token with no expiry, shows an em dash read as None"}
      </figcaption>
    </figure>
  );
}
