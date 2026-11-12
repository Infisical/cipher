import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { DataTable } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

const initial = [
  { id: "owner", name: "Production owner", locked: true, deactivated: false },
  { id: "worker", name: "Rotation worker", locked: false, deactivated: false },
  { id: "expired", name: "Expired integration", locked: false, deactivated: true }
];
const columns = [
  {
    id: "name",
    header: "Identity",
    render: (row: (typeof initial)[number]) => (
      <span className="inline-flex items-center gap-2">
        {row.name}
        {row.deactivated && <Badge size="sm">Deactivated</Badge>}
      </span>
    )
  },
  {
    id: "access",
    header: "Access",
    render: (row: (typeof initial)[number]) => (row.locked ? "Owner, protected" : "Revocable")
  }
];
export default function States() {
  const [selected, setSelected] = React.useState<string[]>(["worker"]);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Empty identities"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            empty={
              <EmptyState
                size="sm"
                media="bare"
                icon="user"
                title="No identities in this environment"
              />
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Protected identities"
            rows={initial}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            selectable
            selectionDisabledReason={(row) =>
              row.locked ? "Owner identities are protected from bulk removal." : undefined
            }
            selectedIds={selected}
            onSelectionChange={setSelected}
            persistentStatus={`${selected.length} eligible loaded identities selected`}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Protected selection"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Loading identities"
            rows={initial}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            loadMore={{ label: "Load more identities", loading: true, onClick: () => undefined }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Loading more, retained rows"}
        </figcaption>
      </figure>
    </div>
  );
}
