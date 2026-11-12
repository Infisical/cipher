import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn, EnvMark } from "@infisical/cipher/ui/data-table";
import { toast } from "@infisical/cipher/ui/sonner";

type Row = { id: string; name: string; count: number; present: boolean };
const rows: Row[] = [
  { id: "production", name: "Production", count: 128, present: true },
  { id: "staging", name: "Staging", count: 0, present: false }
];
export default function Variants() {
  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: "Environment",
      primary: true,
      grow: true,
      align: "start",
      render: (row) => row.name
    },
    { id: "count", header: "Secrets", align: "end", render: (row) => row.count },
    {
      id: "present",
      header: "Present",
      align: "center",
      render: (row) => <EnvMark present={row.present} env={row.name} />
    },
    {
      id: "actions",
      header: "Actions",
      actions: true,
      pin: true,
      hideHeader: true,
      render: (row) => (
        <Button
          variant="ghost"
          aria-label={`Open ${row.name}`}
          onClick={() => toast(`${row.name} contains ${row.count} fabricated secrets.`)}
        >
          Open
        </Button>
      )
    }
  ];
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      {(["basic", "striped", "bordered"] as const).map((variant) => (
        <figure
          key={variant}
          aria-label={`${variant} variant`}
          className="m-0 flex w-full min-w-0 flex-col gap-3"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <DataTable
              label={`${variant} environments`}
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              rowLabel={(row) => row.name}
              variant={variant}
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
        </figure>
      ))}
    </div>
  );
}
