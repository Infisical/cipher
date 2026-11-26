import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { DropdownMenuItem } from "@infisical/cipher/ui/dropdown-menu";
import { toast } from "@infisical/cipher/ui/sonner";

type Identity = {
  id: string;
  name: string;
  role: string;
  auth: string;
  restricted?: string;
};

const identities: Identity[] = [
  { id: "ci", name: "github-actions-deployer", role: "Developer", auth: "OIDC" },
  {
    id: "hidden-1",
    name: "",
    role: "",
    auth: "",
    restricted: "You don't have permission to view this machine identity"
  },
  {
    id: "billing",
    name: "billing-reconciliation-worker-eu-central-production-replica",
    role: "Viewer",
    auth: "Universal Auth"
  },
  { id: "hidden-2", name: "", role: "", auth: "", restricted: "Restricted machine identity" }
];

const columns: DataTableColumn<Identity>[] = [
  {
    id: "name",
    header: "Name",
    primary: true,
    grow: true,
    minWidth: 200,
    render: (row) => row.name
  },
  { id: "role", header: "Role", width: 120, dropFirst: true, render: (row) => row.role },
  { id: "auth", header: "Auth method", width: 150, dropFirst: true, render: (row) => row.auth }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Project machine identities"
            rows={identities}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.name || "Restricted machine identity"}
            getRowRestricted={(row) => row.restricted}
            selectable
            onRowActivate={(row) => toast(`Opened ${row.name}.`)}
            rowActions={{
              inline: [
                {
                  label: "Copy ID",
                  icon: "copy",
                  onSelect: (row) => toast(`Copied the ID of ${row.name}.`)
                }
              ],
              renderMenu: (row) => (
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => toast(`Removed ${row.name}.`)}
                >
                  Remove from project
                </DropdownMenuItem>
              )
            }}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {
            "getRowRestricted keeps rows the viewer can't see in place, muted, with a lock and the reason, and no selection, actions or activation"
          }
        </figcaption>
      </figure>
    </div>
  );
}
