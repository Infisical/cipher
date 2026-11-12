import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Stack } from "@infisical/cipher/ui/layout";

type Key = { id: string; name: string; algorithm: string; status: "active" | "disabled" };
const keys: Key[] = [
  { id: "backup", name: "backup-signing", algorithm: "AES-256-GCM", status: "active" },
  { id: "billing", name: "billing-pii", algorithm: "AES-256-GCM", status: "active" },
  { id: "legacy", name: "legacy-exports", algorithm: "AES-128-GCM", status: "disabled" }
];
const columns: DataTableColumn<Key>[] = [
  { id: "name", header: "Name", primary: true, grow: true, render: (row) => row.name },
  { id: "algorithm", header: "Algorithm", width: 136, render: (row) => row.algorithm },
  {
    id: "status",
    header: "Status",
    width: 112,
    render: (row) =>
      row.status === "active" ? (
        <Badge tone="ok" dot>
          Active
        </Badge>
      ) : (
        <Badge tone="outline">Disabled</Badge>
      )
  },
  {
    id: "actions",
    header: "Actions",
    actions: true,
    render: (row) => (
      <Button variant="ghost" size="icon-row" icon="more" iconOnly>
        {`Actions for ${row.name}`}
      </Button>
    )
  }
];

function KeyTable({ label, loading }: { label: string; loading?: boolean }) {
  return (
    <DataTable
      label={label}
      rows={keys}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.name}
      selectable
      loading={loading}
      loadingRows={3}
    />
  );
}

export default function Loading() {
  const [reloading, setReloading] = React.useState(false);
  React.useEffect(() => {
    if (!reloading) return undefined;
    const timer = window.setTimeout(() => setReloading(false), 1200);
    return () => window.clearTimeout(timer);
  }, [reloading]);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <KeyTable label="Keys, loading" loading />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <KeyTable label="Keys, loaded" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loaded"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Stack gap={12}>
            <div>
              <Button variant="outline" disabled={reloading} onClick={() => setReloading(true)}>
                Reload keys
              </Button>
            </div>
            <KeyTable label="Keys, reloadable" loading={reloading} />
          </Stack>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Reload in place"}</figcaption>
      </figure>
    </div>
  );
}
