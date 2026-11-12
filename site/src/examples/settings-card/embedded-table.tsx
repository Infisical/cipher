import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";

type Contact = { email: string; added: string };

const contacts: Contact[] = [
  { email: "sarah.lin@acme-payments.example.com", added: "Mar 4, 2026" },
  { email: "oncall-security-escalations-primary@acme-payments.example.com", added: "Jan 12, 2026" },
  { email: "d.okafor@acme-payments.example.com", added: "Nov 30, 2025" }
];

export default function Example() {
  const [rows, setRows] = useState(contacts);
  const [name, setName] = useState("Acme Payments");
  const [saved, setSaved] = useState("Acme Payments");
  const columns: DataTableColumn<Contact>[] = [
    {
      id: "email",
      header: "Email",
      grow: true,
      text: (row) => row.email,
      render: (row) => row.email
    },
    {
      id: "added",
      header: "Added",
      width: 140,
      text: (row) => row.added,
      render: (row) => row.added
    },
    {
      id: "actions",
      header: "Actions",
      actions: true,
      render: (row) => (
        <Button
          variant="ghost"
          size="icon-row"
          icon="trash"
          iconOnly
          onClick={() => setRows((current) => current.filter((item) => item.email !== row.email))}
        >
          {`Remove ${row.email}`}
        </Button>
      )
    }
  ];
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex flex-col gap-4">
            <SettingsCard
              title="Organization name"
              dirty={name !== saved}
              onDiscard={() => setName(saved)}
              onSave={() => setSaved(name)}
            >
              <Field label="Name">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
            </SettingsCard>
            <SettingsCard
              flush
              title="Incident contacts"
              description="Emailed when a secret leak or a failed rotation is detected."
              action={
                <Button variant="outline" size="sm" icon="plus">
                  Add contact
                </Button>
              }
            >
              <DataTable
                label="Incident contacts"
                rows={rows}
                columns={columns}
                getRowId={(row) => row.email}
                rowLabel={(row) => row.email}
                empty="No incident contacts"
              />
            </SettingsCard>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"default above flush, headers aligned"}
        </figcaption>
      </figure>
    </div>
  );
}
