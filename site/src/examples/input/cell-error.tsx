import * as React from "react";

import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Input } from "@infisical/cipher/ui/input";

type Environment = { id: string; name: string; slug: string };

const initial: Environment[] = [
  { id: "1", name: "Development", slug: "dev" },
  { id: "2", name: "Staging", slug: "dev" },
  { id: "3", name: "Production replica for the EU payments ledger", slug: "" }
];

export default function Example() {
  const [rows, setRows] = React.useState(initial);
  const update = (id: string, change: Partial<Environment>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...change } : row)));
  const slugError = (row: Environment) => {
    if (!row.slug) return "Enter a slug.";
    if (rows.some((other) => other.id !== row.id && other.slug === row.slug))
      return `Another environment already uses ${row.slug}.`;
  };
  const columns: DataTableColumn<Environment>[] = [
    {
      id: "name",
      header: "Name",
      grow: true,
      minWidth: 200,
      render: (row) => (
        <Input
          size="xs"
          aria-label={`Name of environment ${row.id}`}
          value={row.name}
          error={row.name ? undefined : "Enter a name."}
          onChange={(event) => update(row.id, { name: event.target.value })}
        />
      )
    },
    {
      id: "slug",
      header: "Slug",
      width: 180,
      render: (row) => (
        <Input
          size="xs"
          mono
          aria-label={`Slug of ${row.name || `environment ${row.id}`}`}
          value={row.slug}
          placeholder="Add a slug"
          error={slugError(row)}
          onChange={(event) => update(row.id, { slug: event.target.value })}
        />
      )
    }
  ];
  return (
    <div className="w-full min-w-0">
      <DataTable
        label="Environments"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name || row.slug}
      />
    </div>
  );
}
