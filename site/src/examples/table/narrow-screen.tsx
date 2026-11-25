import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";

type Project = {
  id: string;
  name: string;
  environment: string;
  secrets: number;
  rotations: number;
  members: number;
};
const projects: Project[] = [
  {
    id: "api",
    name: "payments-api",
    environment: "Production",
    secrets: 1284,
    rotations: 42,
    members: 18
  },
  {
    id: "legacy",
    name: "legacy-billing-service-migrated-from-the-previous-region",
    environment: "Staging",
    secrets: 38,
    rotations: 0,
    members: 4
  },
  {
    id: "web",
    name: "dashboard-web",
    environment: "Development",
    secrets: 512,
    rotations: 7,
    members: 31
  }
];

const columns: DataTableColumn<Project>[] = [
  { id: "name", header: "Project", primary: true, grow: true, render: (row) => row.name },
  { id: "environment", header: "Environment", width: 140, render: (row) => row.environment },
  { id: "secrets", header: "Secrets", width: 100, align: "end", render: (row) => row.secrets },
  {
    id: "rotations",
    header: "Rotations",
    width: 110,
    align: "end",
    render: (row) => row.rotations
  },
  { id: "members", header: "Members", width: 100, align: "end", render: (row) => row.members }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Projects"
            rows={projects}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "The primary column keeps size-text-min, so a narrow screen scrolls the number columns instead of squeezing names"
          }
        </figcaption>
      </figure>
    </div>
  );
}
