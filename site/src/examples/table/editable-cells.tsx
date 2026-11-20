import * as React from "react";

import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { toast } from "@infisical/cipher/ui/sonner";

type Secret = { id: string; key: string; value: string; comment: string };

const initial: Secret[] = [
  { id: "1", key: "DATABASE_URL", value: "postgres://app@db.internal:5432/app", comment: "" },
  { id: "2", key: "STRIPE_SECRET_KEY", value: "sk_example_8x2q", comment: "Rotated quarterly" },
  {
    id: "3",
    key: "STRIPE_WEBHOOK_SIGNING_SECRET_FOR_BILLING_RECONCILIATION_JOBS",
    value: "whsec_example_9f2c7e1b4a6d8f0e3c5b7a9d1f3e5c7b9a1d3f5e7c9b1a3d5f7e9c",
    comment: "Used by the nightly reconciliation export and the EU billing worker"
  },
  { id: "4", key: "SENTRY_DSN", value: "https://3f1a@o12.ingest.sentry.io/41", comment: "" }
];

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Example() {
  const [rows, setRows] = React.useState(initial);
  const update = (id: string, change: Partial<Secret>) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...change } : row)));
  const columns: DataTableColumn<Secret>[] = [
    {
      id: "key",
      header: "Key",
      primary: true,
      mono: true,
      grow: true,
      minWidth: 200,
      text: (row) => row.key,
      render: (row) => row.key,
      edit: (row) => ({
        label: `Key of ${row.key}`,
        value: row.key,
        mono: true,
        transform: (value) => value.toUpperCase().replace(/[^A-Z0-9_]/g, "_"),
        validate: async (value) => {
          await pause(300);
          if (!value) return "Enter a key.";
          if (rows.some((other) => other.id !== row.id && other.key === value))
            return `${value} already exists in this folder.`;
        },
        onInvalidBlur: (message) => toast(`Kept ${row.key}. ${message}`),
        onCommit: (key) => update(row.id, { key })
      })
    },
    {
      id: "value",
      header: "Value",
      mono: true,
      width: 280,
      text: () => "Hidden value",
      render: () => "••••••••••••",
      edit: (row) => ({
        label: `Value of ${row.key}`,
        value: async () => {
          await pause(200);
          return row.value;
        },
        mono: true,
        onCommit: (value) => update(row.id, { value })
      })
    },
    {
      id: "comment",
      header: "Comment",
      width: 260,
      text: (row) => row.comment,
      render: (row) => row.comment || <span className="text-muted-foreground">Add a comment</span>,
      edit: (row) => ({
        label: `Comment on ${row.key}`,
        value: row.comment,
        multiline: true,
        placeholder: "Add a comment",
        onCommit: (comment) => update(row.id, { comment })
      })
    }
  ];
  return (
    <div className="w-full min-w-0">
      <DataTable
        label="Secrets"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.key}
      />
    </div>
  );
}
