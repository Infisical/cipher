import { useState } from "react";

import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { toast } from "@infisical/cipher/ui/sonner";

type Row = { id: string; name: string };
const rows: Row[] = [
  { id: "database-url", name: "DATABASE_URL" },
  { id: "log-level", name: "LOG_LEVEL" },
  { id: "jwt-signing-key", name: "JWT_SIGNING_KEY" }
];
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Name", primary: true, grow: true, render: (row) => row.name }
];

export default function RowActionLoading() {
  const [rotating, setRotating] = useState<ReadonlySet<string>>(() => new Set(["log-level"]));
  const rotate = (row: Row) => {
    setRotating((current) => new Set(current).add(row.id));
    window.setTimeout(() => {
      setRotating((current) => {
        const next = new Set(current);
        next.delete(row.id);
        return next;
      });
      toast(`Rotated ${row.name}.`);
    }, 2000);
  };
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <DataTable
        label="Example secrets with a rotate action"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        rowActions={{
          inline: [
            {
              label: "Copy secret",
              icon: "copy",
              onSelect: (row) => toast(`Copied the fabricated value of ${row.name}.`)
            },
            {
              label: "Rotate secret",
              icon: "sync",
              loading: (row) => rotating.has(row.id),
              onSelect: rotate
            }
          ]
        }}
      />
      <figcaption className="text-muted-foreground text-xs">
        {
          "A row action's loading shows the button's spinner at the same size and blocks it until the action finishes"
        }
      </figcaption>
    </figure>
  );
}
