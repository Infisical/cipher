import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { toast } from "@infisical/cipher/ui/sonner";

type Run = {
  id: string;
  name: string;
  environment: string;
  started: string;
  duration: string;
  outcome: "Succeeded" | "Failed";
  reason: string;
};

const runs: Run[] = [
  {
    id: "rotate-db",
    name: "rotate-postgres-production-credentials",
    environment: "Production",
    started: "2026-11-26 14:02 UTC",
    duration: "48s",
    outcome: "Failed",
    reason:
      "The database rejected the new credentials: password authentication failed for user app_rotation"
  },
  {
    id: "sync-vercel",
    name: "sync-vercel-preview",
    environment: "Staging",
    started: "2026-11-26 13:40 UTC",
    duration: "12s",
    outcome: "Succeeded",
    reason: "Synced 38 secrets to 2 projects"
  },
  {
    id: "rotate-aws",
    name: "rotate-aws-iam-keys",
    environment: "Development",
    started: "2026-11-26 12:15 UTC",
    duration: "1m 4s",
    outcome: "Succeeded",
    reason: "Rotated 2 access keys"
  }
];

const columns: DataTableColumn<Run>[] = [
  { id: "name", header: "Run", primary: true, grow: true, mono: true, render: (row) => row.name },
  { id: "environment", header: "Environment", width: 140, render: (row) => row.environment },
  { id: "started", header: "Started", width: 190, render: (row) => row.started },
  { id: "duration", header: "Duration", width: 100, align: "end", render: (row) => row.duration },
  {
    id: "outcome",
    header: "Outcome",
    width: 130,
    render: (row) => (
      <Badge tone={row.outcome === "Failed" ? "bad" : "ok"} reason={row.reason}>
        {row.outcome}
      </Badge>
    )
  }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <DataTable
        label="Automation runs"
        rows={runs}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        onRowActivate={(row) => toast(`Opened ${row.name}.`)}
      />
      <figcaption className="text-muted-foreground text-xs">
        {
          "On a narrow screen the Outcome reason sits past the scrolled edge, so a row focused by keyboard shows its tooltip over the part of the row in view"
        }
      </figcaption>
    </figure>
  );
}
