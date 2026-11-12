import {
  DataTable,
  type DataTableColumn,
  type DataTableRowActions
} from "@infisical/cipher/ui/data-table";
import { DropdownMenuItem } from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";
import { Inline } from "@infisical/cipher/ui/layout";
import { toast } from "@infisical/cipher/ui/sonner";
import { StatusText } from "@infisical/cipher/ui/text";
import { TooltipProvider, TooltipText } from "@infisical/cipher/ui/tooltip";

type Row = {
  id: string;
  name: string;
  rotated: string;
  locked: boolean;
  environments: Record<string, boolean>;
};

const environments = [
  { id: "dev", label: "Development" },
  { id: "staging", label: "Staging" },
  { id: "prod", label: "Production" }
];

const names = [
  "DATABASE_URL",
  "LOG_LEVEL",
  "JWT_SIGNING_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "REDIS_URL",
  "SMTP_PASSWORD"
];

const rows: Row[] = names.map((name, index) => ({
  id: name.toLowerCase(),
  name,
  rotated: `2026-10-${String(29 - index).padStart(2, "0")} 14:02 UTC`,
  locked: index % 3 === 2,
  environments: { dev: true, staging: index % 2 === 0, prod: index % 4 !== 1 }
}));

export default function SharedTooltips() {
  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: "Name",
      primary: true,
      mono: true,
      grow: true,
      render: (row) => row.name
    },
    {
      id: "rotation",
      header: "Rotation",
      render: (row) => (
        <TooltipText
          asChild
          content={
            <>
              Last rotated <code>{row.rotated}</code>
            </>
          }
        >
          <StatusText icon={row.locked ? "lock" : "clock"}>
            {row.locked ? "Locked" : "Scheduled"}
          </StatusText>
        </TooltipText>
      )
    },
    {
      id: "environments",
      header: "Environments",
      render: (row) => (
        <Inline gap={8} wrap={false}>
          {environments.map((env) => {
            const present = row.environments[env.id];
            return (
              <TooltipText
                key={env.id}
                asChild
                content={`${present ? "Present" : "Missing"} in ${env.label}`}
              >
                <span>
                  <Icon
                    name={present ? "check-c" : "minus"}
                    label={`${env.label}: ${present ? "present" : "missing"}`}
                  />
                </span>
              </TooltipText>
            );
          })}
        </Inline>
      )
    }
  ];
  const actions: DataTableRowActions<Row> = {
    inline: [
      {
        label: "Copy secret",
        icon: "copy",
        onSelect: (row) => toast(`Copied the fabricated value of ${row.name}.`)
      },
      {
        label: "Rotate now",
        icon: "sync",
        disabledReason: (row) => (row.locked ? "Locked secrets can't be rotated" : undefined),
        onSelect: (row) => toast(`Rotated ${row.name}.`)
      }
    ],
    renderMenu: (row) => (
      <DropdownMenuItem onSelect={() => toast(`Opened ${row.name}.`)}>
        <Icon name="eye" />
        Open secret
      </DropdownMenuItem>
    )
  };
  return (
    <TooltipProvider>
      <DataTable
        label="Example secrets with status marks and row actions"
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => row.name}
        rowActions={actions}
      />
    </TooltipProvider>
  );
}
