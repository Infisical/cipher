import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Line = {
  id: string;
  product: string;
  plan: string;
  seats: number;
  amount: number;
  archived?: boolean;
};
const lines: Line[] = [
  { id: "secrets", product: "Secrets Management", plan: "Enterprise, annual", seats: 120, amount: 54000 },
  { id: "pki", product: "Certificate Manager", plan: "Pro, monthly", seats: 40, amount: 9600 },
  { id: "scanning", product: "Secret Scanning", plan: "Pro, monthly", seats: 40, amount: 4800 },
  { id: "kms", product: "KMS", plan: "Legacy add-on", seats: 10, amount: 0, archived: true }
];
const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents);
const live = lines.filter((line) => !line.archived);

const columns: DataTableColumn<Line>[] = [
  {
    id: "product",
    header: "Product",
    primary: true,
    grow: true,
    render: (row) => row.product,
    secondary: (row) => row.plan,
    footer: "Total"
  },
  {
    id: "status",
    header: "Status",
    width: 120,
    render: (row) =>
      row.archived ? <Badge tone="outline">Archived</Badge> : <Badge tone="ok" dot>Active</Badge>
  },
  {
    id: "seats",
    header: "Seats",
    width: 100,
    align: "end",
    render: (row) => row.seats,
    footer: live.reduce((sum, line) => sum + line.seats, 0)
  },
  {
    id: "amount",
    header: "Amount",
    width: 140,
    align: "end",
    render: (row) => money(row.amount),
    footer: money(live.reduce((sum, line) => sum + line.amount, 0))
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Subscription lines"
            rows={lines}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.product}
            isRowMuted={(row) => Boolean(row.archived)}
            rowActions={{
              inline: [{ label: "Copy line ID", icon: "copy", onSelect: () => undefined }]
            }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"secondary under Product, isRowMuted for the archived line, and footer totals that leave it out"}
        </figcaption>
      </figure>
    </div>
  );
}
