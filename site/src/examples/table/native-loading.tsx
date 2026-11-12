import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import {
  Table,
  TableActionsHead,
  TableBody,
  TableHead,
  TableHeader,
  TableLoadingRows,
  TableRow
} from "@infisical/cipher/ui/table";

type Secret = { id: string; key: string; production: string; staging: string };
const columns: DataTableColumn<Secret>[] = [
  { id: "key", header: "Key", primary: true, mono: true, grow: true, render: (row) => row.key },
  { id: "production", header: "Production", width: 160, render: (row) => row.production },
  { id: "staging", header: "Staging", width: 160, render: (row) => row.staging }
];

export default function NativeLoading() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Table aria-label="Secrets, loading" aria-busy>
            <TableHeader>
              <TableRow>
                <TableHead selection />
                <TableHead scope="col">Key</TableHead>
                <TableHead scope="col" style={{ width: 160 }}>
                  Production
                </TableHead>
                <TableHead scope="col" style={{ width: 160 }}>
                  Staging
                </TableHead>
                <TableActionsHead slots={2} />
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableLoadingRows
                label="Loading secrets"
                rows={3}
                selectable
                actionSlots={2}
                columns={[{ primary: true }, { style: { width: 160 } }, { style: { width: 160 } }]}
              />
            </TableBody>
          </Table>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Native Table with TableLoadingRows, as in a sheet or the secrets matrix"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Secrets, loading"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.key}
            selectable
            loading
            loadingRows={3}
            rowActions={{
              inline: [
                { label: "Copy", icon: "copy", onSelect: () => {} },
                { label: "History", icon: "history", onSelect: () => {} }
              ]
            }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"DataTable loading"}</figcaption>
      </figure>
    </div>
  );
}
