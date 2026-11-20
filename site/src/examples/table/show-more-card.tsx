import { useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Row = { id: string; event: string; user: string; time: string };
const total = 38;
const page = 5;
const events = ["User created", "User updated", "Group membership changed", "User deactivated"];
const makeRows = (count: number): Row[] =>
  Array.from({ length: Math.min(count, total) }, (_, index) => ({
    id: `scim-${index}`,
    event: events[index % events.length],
    user:
      index === 1
        ? "alexandra.konstantinopoulou@engineering.example.com"
        : `user${index}@example.com`,
    time: `${index + 1}h ago`
  }));
const columns: DataTableColumn<Row>[] = [
  { id: "event", header: "Event", width: 200, render: (row) => row.event },
  { id: "user", header: "User", primary: true, grow: true, render: (row) => row.user },
  { id: "time", header: "Time", width: 96, align: "end", render: (row) => row.time }
];

export default function Example() {
  const [shown, setShown] = useState(page);
  const rows = makeRows(shown);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <Card variant="framed" title="SCIM events" flush footerPlacement="frame">
        <DataTable
          label="SCIM events"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.event}
          persistentStatus={`Showing ${rows.length} of ${total} events in the last 30 days`}
          loadMore={shown < total ? { onClick: () => setShown(shown + page) } : undefined}
          showFewer={shown > page ? { onClick: () => setShown(page) } : undefined}
        />
      </Card>
      <figcaption className="text-muted-foreground text-xs">
        {"In a framed Card the count and Show more move into the frame footer"}
      </figcaption>
    </figure>
  );
}
