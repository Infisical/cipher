import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

type Project = {
  id: string;
  name: string;
  environment: string;
  owner: string;
  secrets: number;
  rotations: number;
  members: number;
};
const projects: Project[] = [
  {
    id: "api",
    name: "payments-api",
    environment: "Production",
    owner: "Payments platform",
    secrets: 1284,
    rotations: 42,
    members: 18
  },
  {
    id: "legacy",
    name: "legacy-billing-service-migrated-from-the-previous-region",
    environment: "Staging",
    owner: "Billing",
    secrets: 38,
    rotations: 0,
    members: 4
  },
  {
    id: "web",
    name: "dashboard-web",
    environment: "Development",
    owner: "Web",
    secrets: 512,
    rotations: 7,
    members: 31
  }
];

const columns: DataTableColumn<Project>[] = [
  { id: "name", header: "Project", primary: true, grow: true, render: (row) => row.name },
  { id: "owner", header: "Owner", grow: true, render: (row) => row.owner },
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
            "The primary column keeps size-text-min, even beside another growing column, so a narrow screen scrolls the other columns instead of squeezing names"
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Empty projects"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            empty={<EmptyState size="sm" media="bare" icon="folder" title="No projects yet" />}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"With no rows the column floors drop, so the empty state fits instead of scrolling"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Matching projects"
            rows={[]}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name}
            filtered
            empty={
              <EmptyState
                size="sm"
                media="bare"
                icon="search"
                title="No projects match these filters"
              />
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Filtered to no matches"}
        </figcaption>
      </figure>
    </div>
  );
}
