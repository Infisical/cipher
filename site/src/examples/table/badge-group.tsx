import { Badge, BadgeGroup } from "@infisical/cipher/ui/badge";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Member = { id: string; name: string; email: string; roles: string[] };

const members: Member[] = [
  { id: "a", name: "Sarah Lin", email: "sarah.lin@example.com", roles: ["Admin"] },
  {
    id: "b",
    name: "Marcus Okonkwo-Fitzgerald",
    email: "marcus.okonkwo-fitzgerald@example.com",
    roles: ["Viewer", "Member", "Billing"]
  },
  {
    id: "c",
    name: "Priya Raman",
    email: "priya.raman@example.com",
    roles: ["Payments release approver", "Secret rotation operator", "Viewer"]
  }
];

const roles = (row: Member) => (
  <BadgeGroup>
    {row.roles.map((role) => (
      <Badge key={role}>{role}</Badge>
    ))}
  </BadgeGroup>
);

function Members({ roleWidth }: { roleWidth?: number }) {
  const columns: DataTableColumn<Member>[] = [
    { id: "name", header: "Name", primary: true, grow: true, render: (row) => row.name },
    { id: "email", header: "Email", width: roleWidth && 240, render: (row) => row.email },
    { id: "roles", header: "Project role", width: roleWidth, render: roles }
  ];
  return (
    <DataTable
      label="Project members"
      rows={members}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.name}
    />
  );
}

export default function Example() {
  return (
    <div className="flex flex-col gap-6">
      <Members />
      <Members roleWidth={200} />
    </div>
  );
}
