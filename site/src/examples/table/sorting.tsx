import * as React from "react";

import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Row = { id: string; key: string; updated: string };
const all: Row[] = [
  { id: "stripe", key: "STRIPE_API_KEY", updated: "2 days ago" },
  { id: "database", key: "DATABASE_URL", updated: "5 hours ago" },
  { id: "sendgrid", key: "SENDGRID_TOKEN", updated: "3 weeks ago" }
];
type Sort = { columnId: string; direction: "asc" | "desc" };
const columns: DataTableColumn<Row>[] = [
  {
    id: "key",
    header: "Key",
    primary: true,
    mono: true,
    sortable: true,
    text: (row) => row.key,
    render: (row) => row.key
  },
  { id: "updated", header: "Updated", render: (row) => row.updated }
];
function SortedTable({ label, initial }: { label: string; initial?: Sort }) {
  const [sort, setSort] = React.useState<Sort | undefined>(initial);
  const rows = sort
    ? [...all].sort((a, b) => a.key.localeCompare(b.key) * (sort.direction === "asc" ? 1 : -1))
    : all;
  return (
    <DataTable
      label={label}
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.key}
      sort={sort}
      onSortChange={setSort}
    />
  );
}
export default function Sorting() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SortedTable label="Unsorted secrets" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Unsorted"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SortedTable label="Ascending secrets" initial={{ columnId: "key", direction: "asc" }} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Ascending"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SortedTable
            label="Descending secrets"
            initial={{ columnId: "key", direction: "desc" }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Descending"}</figcaption>
      </figure>
    </div>
  );
}
