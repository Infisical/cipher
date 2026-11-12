import { useMemo, useState } from "react";

import { DataTable, type DataTableColumn, EnvMark } from "@infisical/cipher/ui/data-table";

type Row = { id: string; name: string; present: boolean };
const all: Row[] = Array.from({ length: 24 }, (_, index) => ({
  id: `resource-${index}`,
  name: `example_resource_${index}`,
  present: index % 3 !== 0
}));
export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sort, setSort] = useState<{ columnId: string; direction: "asc" | "desc" }>();
  const rows = useMemo(
    () =>
      sort
        ? [...all].sort(
            (a, b) => a.name.localeCompare(b.name) * (sort.direction === "asc" ? 1 : -1)
          )
        : all,
    [sort]
  );
  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: "Name",
      primary: true,
      sortable: true,
      maxWidth: 240,
      text: (row) => row.name,
      render: (row) => row.name
    },
    {
      id: "environment",
      header: "Production",
      render: (row) => <EnvMark present={row.present} env="Production" />
    }
  ];
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <div className="relative max-h-[400px] w-full min-w-0 overflow-auto">
          <DataTable
            label="Example resource table"
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            selectable
            selectedIds={selected}
            onSelectionChange={setSelected}
            sort={sort}
            height={320}
            virtual
            onSortChange={setSort}
            persistentStatus={`${rows.length} resources. ${selected.length} selected.`}
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Selection, sorting and virtual scrolling"}
      </figcaption>
    </figure>
  );
}
