import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

type Grant = { id: string; folder: string; environment: string; access: string };

const grants: Grant[] = [
  { id: "api", folder: "/api", environment: "Production", access: "Read" },
  { id: "billing", folder: "/billing/stripe", environment: "Staging", access: "Write" }
];
const stressed: Grant[] = Array.from({ length: 8 }, (_, index) => ({
  id: String(index),
  folder: `/services/payments/providers/stripe/webhooks/region-${index + 1}/signing-secrets`,
  environment: index % 2 ? "Development (shared, read-mostly)" : "Production",
  access: index % 3 ? "Read" : "Write"
}));

const columns: DataTableColumn<Grant>[] = [
  { id: "folder", header: "Folder", primary: true, grow: true, render: (row) => row.folder },
  { id: "environment", header: "Environment", width: 160, render: (row) => row.environment },
  { id: "access", header: "Access", width: 96, render: (row) => row.access }
];

const table = (rows: Grant[], loading = false) => (
  <DataTable
    label="Folder access"
    rows={rows}
    columns={columns}
    getRowId={(row) => row.id}
    rowLabel={(row) => row.folder}
    loading={loading}
    loadingRows={2}
    empty={<EmptyState size="sm" icon="folder" title="This user has no folder access" />}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {[
        ["Empty", table([])],
        ["Loading", table([], true)],
        ["Rows", table(grants)],
        ["Many rows, long values", table(stressed)]
      ].map(([caption, body]) => (
        <figure key={caption as string} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Card variant="framed" title="Folder access">
            {body}
          </Card>
          <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
