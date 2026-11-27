import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { CellLink, RowLink } from "@infisical/cipher/ui/row-link";

type Secret = {
  key: string;
  path: string;
};
const secrets: Secret[] = [
  {
    key: "DATABASE_URL",
    path: "/backend/api"
  },
  {
    key: "STRIPE_WEBHOOK_SIGNING_SECRET_FOR_EU_CENTRAL_PRODUCTION_BILLING_SERVICE_V2",
    path: "/services/billing/payments/webhooks/eu-central/production/stripe-signing-secrets"
  },
  {
    key: "GITHUB_APP_PRIVATE_KEY",
    path: "/integrations/github"
  }
];

export default function Example() {
  const columns: DataTableColumn<Secret>[] = [
    {
      id: "key",
      header: "Key",
      primary: true,
      mono: true,
      wrap: true,
      grow: true,
      text: (row) => row.key,
      render: (row) => (
        <RowLink link={{ href: `/secrets/${row.key.toLowerCase()}` }}>{row.key}</RowLink>
      )
    },
    {
      id: "path",
      header: "Path",
      width: 160,
      text: (row) => row.path,
      render: (row) => (
        <CellLink link={{ href: `/folders${row.path}` }} title={row.path}>
          {row.path}
        </CellLink>
      )
    }
  ];
  return (
    <div className="w-full min-w-0">
      <figure className="m-0 flex w-full max-w-3xl min-w-0 flex-col gap-3">
        <DataTable
          label="Duplicated secrets"
          rows={secrets}
          columns={columns}
          getRowId={(row) => row.key}
          rowLabel={(row) => row.key}
        />
        <figcaption className="text-muted-foreground text-xs">
          {"The key column wraps, so its link wraps too; the path column truncates"}
        </figcaption>
      </figure>
    </div>
  );
}
