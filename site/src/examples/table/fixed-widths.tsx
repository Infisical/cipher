import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Run = {
  id: string;
  scan: string;
  status: "Completed" | "Running" | "Failed";
  started: string;
  duration: string;
  found: number;
  added: number;
  trigger: string;
};
type Sort = { columnId: string; direction: "asc" | "desc" };

const runs: Run[] = [
  {
    id: "1",
    scan: "Production load balancers",
    status: "Completed",
    started: "Jun 15, 2026 09:12",
    duration: "4m 12s",
    found: 248,
    added: 3,
    trigger: "Schedule"
  },
  {
    id: "2",
    scan: "Internal services on 10.0.0.0/16",
    status: "Running",
    started: "Jun 15, 2026 08:40",
    duration: "32m 05s",
    found: 1032,
    added: 0,
    trigger: "Sarah Chen"
  },
  {
    id: "3",
    scan: "Edge endpoints in eu-central-1 and us-east-1 behind the shared ingress",
    status: "Failed",
    started: "Jun 14, 2026 22:03",
    duration: "1m 48s",
    found: 0,
    added: 0,
    trigger: "Schedule"
  }
];

const tone = { Completed: "ok", Running: "info", Failed: "bad" } as const;

const columns: DataTableColumn<Run>[] = [
  { id: "scan", header: "Scan", primary: true, grow: true, render: (run) => run.scan },
  {
    id: "status",
    header: "Status",
    width: 128,
    render: (run) => (
      <Badge tone={tone[run.status]} dot>
        {run.status}
      </Badge>
    )
  },
  { id: "started", header: "Started at", width: 176, render: (run) => run.started },
  { id: "duration", header: "Duration", width: 112, align: "end", render: (run) => run.duration },
  {
    id: "found",
    header: "Certificates found",
    width: 136,
    align: "end",
    sortable: true,
    render: (run) => run.found.toLocaleString("en-US")
  },
  { id: "added", header: "New certificates", width: 128, align: "end", render: (run) => run.added },
  { id: "trigger", header: "Triggered by", width: 136, render: (run) => run.trigger }
];

function Runs({ label }: { label: string }) {
  const [sort, setSort] = React.useState<Sort | undefined>();
  return (
    <DataTable
      label={label}
      columns={columns}
      rows={runs}
      getRowId={(run) => run.id}
      rowLabel={(run) => run.scan}
      sort={sort}
      onSortChange={setSort}
    />
  );
}

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Runs label="Scan runs" />
      <div className="w-full max-w-[960px] min-w-0">
        <Runs label="Scan runs in a narrower container" />
      </div>
    </div>
  );
}
