import * as React from "react";

import { Badge, BadgeGroup } from "@infisical/cipher/ui/badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableGroup
} from "@infisical/cipher/ui/data-table";
import { DropdownMenuItem } from "@infisical/cipher/ui/dropdown-menu";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { RowLink } from "@infisical/cipher/ui/row-link";
import { toast } from "@infisical/cipher/ui/sonner";

type Duplicate = {
  id: string;
  key: string;
  environments: string[];
  folders: string[];
  values: number;
};
type Project = { id: string; name: string; duplicates: Duplicate[] };
type Sort = { columnId: string; direction: "asc" | "desc" };

const typical: Project[] = [
  {
    id: "payments",
    name: "payments-api",
    duplicates: [
      {
        id: "db-password",
        key: "DB_PASSWORD",
        environments: ["Production", "Staging"],
        folders: ["/", "/workers"],
        values: 2
      },
      {
        id: "stripe-key",
        key: "STRIPE_SECRET_KEY",
        environments: ["Production"],
        folders: ["/billing", "/legacy"],
        values: 1
      }
    ]
  },
  {
    id: "web",
    name: "dashboard-web",
    duplicates: [
      {
        id: "session",
        key: "SESSION_SECRET",
        environments: ["Development", "Staging", "Production"],
        folders: ["/"],
        values: 3
      }
    ]
  }
];

const longEnvironments = ["Production", "Staging", "Development", "Preview", "QA", "Load test"];
const stressed: Project[] = [
  {
    id: "legacy",
    name: "legacy-billing-service-migrated-from-the-previous-region",
    duplicates: Array.from({ length: 5 }, (_, index) => ({
      id: `legacy-${index}`,
      key: `LEGACY_BILLING_PROVIDER_WEBHOOK_SIGNING_SECRET_ROTATED_${2020 + index}`,
      environments: longEnvironments.slice(0, 2 + index),
      folders: ["/services/billing/webhooks/provider-callbacks", "/archive/2021/migrated"],
      values: 4 + index
    }))
  },
  {
    id: "edge",
    name: "edge-gateway",
    duplicates: [
      {
        id: "edge-token",
        key: "CLOUDFLARE_API_TOKEN",
        environments: longEnvironments,
        folders: ["/"],
        values: 12
      }
    ]
  }
];

const environmentBadges = (row: Duplicate) => (
  <BadgeGroup>
    {row.environments.map((environment) => (
      <Badge key={environment}>{environment}</Badge>
    ))}
  </BadgeGroup>
);

function Duplicates({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<Sort>({ columnId: "key", direction: "asc" });
  const columns: DataTableColumn<Duplicate>[] = [
    {
      id: "key",
      header: "Secret key",
      primary: true,
      mono: true,
      grow: true,
      sortable: true,
      text: (row) => row.key,
      render: (row) => <RowLink link={{ href: "#/components/table" }}>{row.key}</RowLink>
    },
    { id: "environments", header: "Environments", grow: true, render: environmentBadges },
    {
      id: "folders",
      header: "Folders",
      mono: true,
      grow: true,
      text: (row) => row.folders.join(", ")
    },
    {
      id: "values",
      header: "Values",
      width: 120,
      align: "end",
      sortable: true,
      text: (row) => `${row.values} distinct`
    }
  ];
  const order = (rows: Duplicate[]) =>
    [...rows].sort(
      (a, b) =>
        (sort.columnId === "values" ? a.values - b.values : a.key.localeCompare(b.key)) *
        (sort.direction === "asc" ? 1 : -1)
    );
  const groups: DataTableGroup<Duplicate>[] = projects.map((project) => ({
    id: project.id,
    label: project.name,
    meta: `${project.duplicates.length}`,
    rows: order(project.duplicates)
  }));
  return (
    <DataTable
      label="Duplicate secrets"
      groups={groups}
      columns={columns}
      getRowId={(row) => row.id}
      rowLabel={(row) => row.key}
      selectable
      selectedIds={selected}
      onSelectionChange={setSelected}
      sort={sort}
      onSortChange={setSort}
      stackBelow={600}
      empty={<EmptyState size="sm" media="bare" icon="key" title="No duplicate secrets" />}
      rowActions={{
        inline: [
          {
            label: "Resolve",
            icon: "arrow-right-left",
            onSelect: (row) => toast(`Resolving ${row.key}.`)
          }
        ],
        renderMenu: (row) => (
          <DropdownMenuItem onSelect={() => toast(`Ignored ${row.key}.`)}>Ignore</DropdownMenuItem>
        )
      }}
    />
  );
}

const states = [
  { caption: "Empty", projects: [] },
  { caption: "Typical", projects: typical },
  { caption: "Long keys, folders and many environments", projects: stressed }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {states.map((state) => (
        <figure
          key={state.caption}
          className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3"
        >
          <Duplicates projects={state.projects} />
          <figcaption className="text-muted-foreground text-xs">{state.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
