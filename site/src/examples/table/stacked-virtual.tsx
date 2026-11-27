import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { toast } from "@infisical/cipher/ui/sonner";

type Log = {
  id: string;
  time: string;
  status: "Succeeded" | "Failed" | "Running";
  destination: string;
  message: string;
  actor: string;
};

const tone = { Succeeded: "ok", Failed: "bad", Running: "info" } as const;

const time = (index: number) =>
  `${String(12 - (Math.floor(index / 60) % 12)).padStart(2, "0")}:${String(59 - (index % 60)).padStart(2, "0")}:${String((index * 7) % 60).padStart(2, "0")}`;

const typical: Log[] = [
  {
    id: "1",
    time: "12:04:31",
    status: "Succeeded",
    destination: "GitHub: infisical/api",
    message: "Synced 42 secrets",
    actor: "sync-bot"
  },
  {
    id: "2",
    time: "11:58:02",
    status: "Failed",
    destination: "AWS Secrets Manager",
    message: "Access denied for role deploy-prod",
    actor: "Sarah Lin"
  },
  {
    id: "3",
    time: "11:40:17",
    status: "Running",
    destination: "Vercel: dashboard-web",
    message: "Syncing",
    actor: "sync-bot"
  }
];

const stressed: Log[] = Array.from({ length: 400 }, (_, index) => ({
  id: `log-${index}`,
  time: time(index),
  status: index % 5 === 1 ? "Failed" : index % 7 === 3 ? "Running" : "Succeeded",
  destination:
    index % 3 === 0
      ? "Azure Key Vault: payments-production-west-europe-secondary-vault"
      : `GitHub: infisical/service-${index}`,
  message:
    index % 5 === 1
      ? "The destination rejected the update because the service principal's client secret expired. Rotate the credential on the app connection and retry."
      : index % 2 === 0
        ? `Synced ${(index * 13) % 300} secrets from /services/billing/webhooks`
        : "Synced",
  actor: index % 4 === 0 ? "machine-identity-production-deployer" : "sync-bot"
}));

const columns: DataTableColumn<Log>[] = [
  { id: "time", header: "Time", width: 96, mono: true, stack: "meta", text: (row) => row.time },
  {
    id: "status",
    header: "Status",
    width: 120,
    render: (row) => <Badge tone={tone[row.status]}>{row.status}</Badge>
  },
  {
    id: "destination",
    header: "Destination",
    primary: true,
    grow: true,
    text: (row) => row.destination
  },
  { id: "message", header: "Message", grow: true, wrap: true, text: (row) => row.message },
  { id: "actor", header: "Actor", width: 160, dropFirst: true, text: (row) => row.actor }
];

function SyncLogs({ rows }: { rows: Log[] }) {
  return (
    <DataTable
      label="Sync logs"
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => `${row.destination} at ${row.time}`}
      stackBelow={600}
      virtual
      height={420}
      empty={<EmptyState size="sm" media="bare" icon="sync" title="No syncs yet" />}
      onRowActivate={(row) => toast(`Opened the ${row.time} sync to ${row.destination}.`)}
    />
  );
}

const states = [
  { caption: "Empty", rows: [] },
  { caption: "Typical", rows: typical },
  { caption: "400 rows with long destinations and wrapping messages", rows: stressed }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {states.map((state) => (
        <figure
          key={state.caption}
          className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3"
        >
          <SyncLogs rows={state.rows} />
          <figcaption className="text-muted-foreground text-xs">{state.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
