import { Button } from "@infisical/cipher/ui/button";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";

type Contact = { email: string; added: string };

const columns: DataTableColumn<Contact>[] = [
  { id: "email", header: "Email", grow: true, text: (row) => row.email, render: (row) => row.email },
  { id: "added", header: "Added", width: 140, text: (row) => row.added, render: (row) => row.added }
];

const rows: Contact[] = [];

const title = "No incident contacts yet";

const table = (label: string) => (
  <DataTable
    label={label}
    rows={rows}
    columns={columns}
    getRowId={(row) => row.email}
    rowLabel={(row) => row.email}
    empty={<EmptyState icon="users" title={title} actions={<Button>Add contact</Button>} />}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
      <SettingsCard flush title="Incident contacts">
        {table("Incident contacts")}
      </SettingsCard>
      {table("Alert recipients")}
      <div className="md:col-span-2">
        <EmptyState icon="folder" title="No projects yet" actions={<Button>Create project</Button>} />
      </div>
    </div>
  );
}
