import * as React from "react";

import {
  DataTable,
  type DataTableColumn,
  type DataTableGroup
} from "@infisical/cipher/ui/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow
} from "@infisical/cipher/ui/table";

type Secret = { id: string; key: string; environment: string };

const folders: { id: string; name: string; secrets: Secret[] }[] = [
  {
    id: "payments",
    name: "payments",
    secrets: [
      { id: "stripe-key", key: "STRIPE_SECRET_KEY", environment: "Production" },
      { id: "stripe-hook", key: "STRIPE_WEBHOOK_SECRET", environment: "Production" },
      { id: "ledger-url", key: "LEDGER_DATABASE_URL", environment: "Staging" }
    ]
  },
  {
    id: "auth",
    name: "auth",
    secrets: [
      { id: "jwt", key: "JWT_SIGNING_KEY", environment: "Production" },
      { id: "oauth", key: "GITHUB_OAUTH_SECRET", environment: "Development" }
    ]
  }
];

const columns: DataTableColumn<Secret>[] = [
  { id: "key", header: "Key", primary: true, grow: true, mono: true, render: (row) => row.key },
  { id: "environment", header: "Environment", width: 160, render: (row) => row.environment }
];

export default function GroupSelection() {
  const [selected, setSelected] = React.useState<string[]>(["stripe-key"]);
  const groups: DataTableGroup<Secret>[] = folders.map((folder) => ({
    id: folder.id,
    label: folder.name,
    meta: `${folder.secrets.length} secrets`,
    rows: folder.secrets
  }));
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataTable
          label="Secrets by folder"
          groups={groups}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.key}
          selectable
          selectedIds={selected}
          onSelectionChange={setSelected}
        />
        <figcaption className="text-muted-foreground text-xs">
          {"A group's checkbox selects every row in it, and the header select-all follows"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Table aria-label="Secrets by folder, drawn by hand">
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Key</TableHead>
              <TableHead scope="col">Environment</TableHead>
            </TableRow>
          </TableHeader>
          {folders.map((folder) => (
            <TableBody key={folder.id} data-group="">
              <TableGroupRow
                label={folder.name}
                meta={`${folder.secrets.length} secrets`}
                colSpan={2}
              />
              {folder.secrets.map((secret) => (
                <TableRow key={secret.id}>
                  <TableCell>{secret.key}</TableCell>
                  <TableCell>{secret.environment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ))}
        </Table>
        <figcaption className="text-muted-foreground text-xs">
          {"TableGroupRow in a hand-built Table"}
        </figcaption>
      </figure>
    </div>
  );
}
