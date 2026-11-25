import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

type Key = { id: string; name: string; algorithm: string; usage: string };

const keys: Key[] = [
  { id: "1", name: "payments-ledger-signing", algorithm: "RSA 4096", usage: "Sign and verify" },
  {
    id: "2",
    name: "customer-data-at-rest-encryption-key-eu-west-1-primary",
    algorithm: "AES 256",
    usage: "Encrypt and decrypt"
  },
  { id: "3", name: "webhooks", algorithm: "ECC P-256", usage: "Sign and verify" }
];

const columns: DataTableColumn<Key>[] = [
  { id: "name", header: "Name", primary: true, grow: true, mono: true, render: (row) => row.name },
  { id: "algorithm", header: "Algorithm", width: 112, render: (row) => row.algorithm },
  { id: "usage", header: "Key usage", width: 160, render: (row) => row.usage }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-wrap items-start gap-3">
        <UI.Dialog>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Small</Button>
          </UI.DialogTrigger>
          <UI.DialogContent>
            <UI.DialogHeader>
              <UI.DialogTitle>Rename environment</UI.DialogTitle>
            </UI.DialogHeader>
            <Field label="Name">
              <Input defaultValue="staging" />
            </Field>
            <UI.DialogFooter>
              <UI.DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </UI.DialogClose>
              <Button>Save</Button>
            </UI.DialogFooter>
          </UI.DialogContent>
        </UI.Dialog>
        <UI.Dialog>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Medium</Button>
          </UI.DialogTrigger>
          <UI.DialogContent size="md">
            <UI.DialogHeader>
              <UI.DialogTitle>Connect a database</UI.DialogTitle>
            </UI.DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Host">
                <Input defaultValue="db.internal.example.com" />
              </Field>
              <Field label="Port">
                <Input defaultValue="5432" />
              </Field>
            </div>
            <UI.DialogFooter>
              <UI.DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </UI.DialogClose>
              <Button>Connect</Button>
            </UI.DialogFooter>
          </UI.DialogContent>
        </UI.Dialog>
        <UI.Dialog>
          <UI.DialogTrigger asChild>
            <Button variant="outline">Large</Button>
          </UI.DialogTrigger>
          <UI.DialogContent size="lg">
            <UI.DialogHeader>
              <UI.DialogTitle>Import 3 keys</UI.DialogTitle>
            </UI.DialogHeader>
            <DataTable
              label="Keys to import"
              rows={keys}
              columns={columns}
              getRowId={(row) => row.id}
              rowLabel={(row) => row.name}
            />
            <UI.DialogFooter>
              <UI.DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </UI.DialogClose>
              <Button>Import</Button>
            </UI.DialogFooter>
          </UI.DialogContent>
        </UI.Dialog>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Sizes: sm, md and lg"}</figcaption>
    </figure>
  );
}
