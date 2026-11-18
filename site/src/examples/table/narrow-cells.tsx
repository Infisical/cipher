import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Row = { id: string; name: string; source?: string; values: string[] };
type Sort = { columnId: string; direction: "asc" | "desc" };

const sets: { caption: string; environments: string[]; rows: Row[] }[] = [
  {
    caption: "One row",
    environments: ["Development", "Production"],
    rows: [{ id: "a", name: "API_URL", values: ["set", "set"] }]
  },
  {
    caption: "Typical",
    environments: ["Development", "Staging", "Production"],
    rows: [
      { id: "a", name: "API_URL", values: ["set", "set", "set"] },
      { id: "b", name: "DATABASE_URL", source: "shared", values: ["set", "missing", "set"] },
      { id: "c", name: "STRIPE_SECRET_KEY", values: ["set", "set", "missing"] }
    ]
  },
  {
    caption: "Long names, an imported row and four environments",
    environments: ["Development", "Staging", "Production EU Central", "Production US East"],
    rows: [
      {
        id: "a",
        name: "PAYMENTS_SETTLEMENT_RECONCILIATION_WORKER_DATABASE_URL",
        values: ["set", "set", "missing", "set"]
      },
      {
        id: "b",
        name: "/payments/settlement/reconciliation",
        source: "Imported from production-eu-central",
        values: ["set", "set", "set", "set"]
      }
    ]
  }
];

function Narrow({ environments, rows }: { environments: string[]; rows: Row[] }) {
  const [sort, setSort] = React.useState<Sort | undefined>({ columnId: "env-1", direction: "asc" });
  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: "Name",
      primary: true,
      grow: true,
      mono: true,
      render: (row) => (
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">{row.name}</span>
          {row.source && <Badge icon="link">{row.source}</Badge>}
        </span>
      )
    },
    ...environments.map((environment, index) => ({
      id: `env-${index}`,
      header: environment,
      width: 96,
      sortable: true,
      render: (row: Row) => row.values[index]
    }))
  ];
  return (
    <DataTable
      label="Secrets by environment"
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.name}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

export default function NarrowCells() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {sets.map((set) => (
        <figure key={set.caption} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Narrow environments={set.environments} rows={set.rows} />
          <figcaption className="text-muted-foreground text-xs">{set.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
