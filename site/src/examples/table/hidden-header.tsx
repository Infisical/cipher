import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

type Row = { id: string; name: string; value: string; status?: string };

const rows: Row[] = [
  { id: "host", name: "Host", value: "db.payments.internal" },
  { id: "port", name: "Port", value: "5432" },
  {
    id: "ca",
    name: "CA certificate",
    value: "payments-settlement-reconciliation-worker-eu-central-1-ca-bundle.pem",
    status: "Expires in 9 days"
  }
];

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "Setting",
    primary: true,
    hideHeader: true,
    width: 120,
    render: (row) => row.name
  },
  {
    id: "value",
    header: "Value",
    grow: true,
    mono: true,
    hideHeader: true,
    render: (row) => row.value,
    badges: (row) => row.status && <Badge tone="warn">{row.status}</Badge>
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <DataTable
        label="Connection details"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
      />
      <DataTable
        label="Empty connection details"
        rows={[]}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        empty={<EmptyState size="sm" media="bare" icon="server" title="No connection settings" />}
      />
    </div>
  );
}
