import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Key = {
  id: string;
  name: string;
  algorithm: string;
  problem?: string;
};
const keys: Key[] = [
  { id: "payments", name: "payments-signing", algorithm: "RSA 4096" },
  {
    id: "legacy",
    name: "legacy-billing-encryption-key-imported-from-the-previous-region-before-migration",
    algorithm: "DES",
    problem: "DES is not supported. Re-encrypt with AES-256 before importing."
  },
  { id: "webhooks", name: "webhook-hmac", algorithm: "HMAC SHA-256" },
  {
    id: "dup",
    name: "payments-signing",
    algorithm: "RSA 4096",
    problem: "A key with this name already exists in the project."
  }
];

const columns: DataTableColumn<Key>[] = [
  {
    id: "name",
    header: "Key",
    primary: true,
    grow: true,
    wrap: true,
    minWidth: 220,
    render: (row) => row.name,
    secondary: (row) => row.problem
  },
  { id: "algorithm", header: "Algorithm", width: 140, render: (row) => row.algorithm },
  {
    id: "status",
    header: "Status",
    width: 120,
    render: (row) =>
      row.problem ? (
        <Badge tone="bad" dot>
          Invalid
        </Badge>
      ) : (
        <Badge tone="ok" dot>
          Ready
        </Badge>
      )
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Keys to import"
            rows={keys}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            rowTone={(row) => (row.problem ? "bad" : undefined)}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"rowTone tints rows an import cannot take, with the reason as the secondary line"}
        </figcaption>
      </figure>
    </div>
  );
}
