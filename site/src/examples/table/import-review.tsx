import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Icon } from "@infisical/cipher/ui/icon";

type Key = {
  id: string;
  name: string;
  usage: string;
  algorithm: string;
  exportable: boolean;
  error?: string;
};
const keys: Key[] = [
  {
    id: "billing",
    name: "billing-pii-eu-central-primary-32",
    usage: "Encrypt and decrypt",
    algorithm: "AES-GCM 256",
    exportable: false
  },
  {
    id: "release",
    name: "release-signing",
    usage: "Sign and verify",
    algorithm: "RSA 4096",
    exportable: true,
    error: "privateKey must be base64 encoded"
  },
  {
    id: "webhook",
    name: "webhook-hmac",
    usage: "MAC",
    algorithm: "HMAC SHA-256",
    exportable: false
  }
];

const columns: DataTableColumn<Key>[] = [
  {
    id: "name",
    header: "Name",
    primary: true,
    grow: true,
    text: (row) => row.name,
    render: (row) => (
      <>
        {row.error && (
          <Icon name="alert-c" label={row.error} className="mr-2 inline align-[-2px]" />
        )}
        {row.name}
      </>
    ),
    badges: (row) => !row.exportable && <Icon name="lock" label="Not exportable" />
  },
  { id: "usage", header: "Usage", grow: true, dropFirst: true, text: (row) => row.usage },
  { id: "algorithm", header: "Algorithm", width: 144, text: (row) => row.algorithm }
];

export default function Example() {
  return (
    <div className="w-full max-w-[640px] min-w-0">
      <DataTable
        label="Keys to import"
        rows={keys}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        rowTone={(row) => (row.error ? "bad" : undefined)}
      />
    </div>
  );
}
