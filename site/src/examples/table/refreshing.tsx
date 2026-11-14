import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Stack } from "@infisical/cipher/ui/layout";

type Sync = { id: string; name: string; destination: string; synced: string; healthy: boolean };
const syncs: Sync[] = [
  { id: "vercel", name: "web-prod", destination: "Vercel", synced: "2 min ago", healthy: true },
  { id: "aws", name: "api-secrets", destination: "AWS Parameter Store", synced: "5 min ago", healthy: true },
  { id: "gh", name: "ci-actions", destination: "GitHub Actions", synced: "1 h ago", healthy: false }
];
const columns: DataTableColumn<Sync>[] = [
  { id: "name", header: "Sync", primary: true, grow: true, render: (row) => row.name },
  { id: "destination", header: "Destination", width: 200, render: (row) => row.destination },
  { id: "synced", header: "Last synced", width: 140, render: (row) => row.synced },
  {
    id: "status",
    header: "Status",
    width: 120,
    render: (row) =>
      row.healthy ? (
        <Badge tone="ok" dot>
          Healthy
        </Badge>
      ) : (
        <Badge tone="bad" dot>
          Failing
        </Badge>
      )
  }
];

export default function Example() {
  const [refreshing, setRefreshing] = React.useState(false);
  React.useEffect(() => {
    if (!refreshing) return undefined;
    const timer = window.setTimeout(() => setRefreshing(false), 2400);
    return () => window.clearTimeout(timer);
  }, [refreshing]);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Secret syncs, refreshing"
            rows={syncs}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            refreshing
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"refreshing"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Stack gap={12}>
            <div>
              <Button variant="outline" icon="sync" disabled={refreshing} onClick={() => setRefreshing(true)}>
                Refetch syncs
              </Button>
            </div>
            <DataTable
              label="Secret syncs"
              rows={syncs}
              columns={columns}
              getRowId={(row) => row.id}
              rowLabel={(row) => row.name}
              refreshing={refreshing}
            />
          </Stack>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Rows stay on screen while the refetch runs"}
        </figcaption>
      </figure>
    </div>
  );
}
