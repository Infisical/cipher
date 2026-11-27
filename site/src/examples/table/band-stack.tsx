import { Alert } from "@infisical/cipher/ui/alert";
import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Secret = { id: string; name: string; updated: string };

const secrets: Secret[] = [
  { id: "1", name: "API_BASE_URL", updated: "10:42" },
  { id: "2", name: "DATABASE_URL", updated: "10:31" },
  { id: "3", name: "STRIPE_WEBHOOK_SIGNING_SECRET_PRODUCTION_EU_WEST_1", updated: "09:58" }
];

const columns: DataTableColumn<Secret>[] = [
  { id: "name", header: "Name", primary: true, grow: true, mono: true, render: (row) => row.name },
  { id: "updated", header: "Updated", width: 96, render: (row) => row.updated }
];

export default function Example() {
  return (
    <Card variant="framed" title="Secrets">
      <Alert band tone="info">
        2 changes need your approval. <a href="#review">Review</a>
      </Alert>
      <DataTable
        label="Secrets"
        rows={secrets}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        headerGround="paper"
      />
    </Card>
  );
}
