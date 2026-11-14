import { CellLink, RowLink } from "@infisical/cipher/ui/row-link";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Dimension = { id: string; label: string; key: string; prices: Record<string, string | null> };
const plans = [
  { id: "free", name: "Free" },
  { id: "pro", name: "Pro" },
  { id: "enterprise", name: "Enterprise" }
];
const dimensions: Dimension[] = [
  { id: "seats", label: "Seats", key: "seats", prices: { free: "$0", pro: "$18 / seat", enterprise: "$32 / seat" } },
  { id: "identities", label: "Machine identities", key: "identities", prices: { free: "5 included", pro: "$4 each", enterprise: "$3 each" } },
  { id: "syncs", label: "Secret syncs", key: "syncs", prices: { free: null, pro: "$2 each", enterprise: "Included" } }
];

const columns: DataTableColumn<Dimension>[] = [
  {
    id: "dimension",
    header: "Dimension",
    primary: true,
    grow: true,
    render: (row) => (
      <RowLink link={{ href: "#/components/row-link" }} chevron={false}>
        {row.label}
      </RowLink>
    ),
    secondary: (row) => row.key
  },
  ...plans.map(
    (plan): DataTableColumn<Dimension> => ({
      id: plan.id,
      header: plan.name,
      width: 160,
      render: (row) => {
        const price = row.prices[plan.id];
        return price ? (
          <CellLink link={{ href: `#/components/row-link?plan=${plan.id}` }} aria-label={`${plan.name}, ${row.label}: ${price}`}>
            {price}
          </CellLink>
        ) : (
          <span className="text-muted-foreground">Not offered</span>
        );
      }
    })
  )
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Pricing matrix"
            rows={dimensions}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.label}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Each price is a CellLink to its plan; the row opens the dimension through RowLink"}
        </figcaption>
      </figure>
    </div>
  );
}
