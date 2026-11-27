import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Member = { id: string; name: string; email: string; role: string };
const roles = ["Admin", "Developer", "Viewer"];
const members: Member[] = Array.from({ length: 500 }, (_, index) => ({
  id: `member-${index}`,
  name: `Member ${index + 1}`,
  email: `member.${index + 1}@acme.dev`,
  role: roles[index % roles.length]
}));

const columns: DataTableColumn<Member>[] = [
  {
    id: "name",
    header: "Name",
    primary: true,
    text: (row) => row.name,
    secondary: (row) => row.email
  },
  { id: "role", header: "Role", width: 120, text: (row) => row.role }
];

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <DataTable
          label="Members"
          rows={members}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.name}
          height={320}
          rowHeight={56}
          virtual
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"500 members, each with an email as the secondary line"}
      </figcaption>
    </figure>
  );
}
