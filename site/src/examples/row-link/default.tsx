import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { Icon, type IconName } from "@infisical/cipher/ui/icon";
import { RowLink } from "@infisical/cipher/ui/row-link";
import { SmallText } from "@infisical/cipher/ui/text";

type Page = {
  id: string;
  group: string;
  title: string;
  icon: IconName;
  status: string;
  ready: boolean;
};
const pages: Page[] = [
  {
    id: "detail",
    group: "data-display",
    title: "Detail",
    icon: "file",
    status: "Data display",
    ready: true
  },
  {
    id: "documentation-link-badge",
    group: "navigation",
    title: "Documentation link badge",
    icon: "link",
    status: "Navigation",
    ready: true
  },
  {
    id: "provider-icon",
    group: "data-display",
    title: "Provider icon",
    icon: "apps",
    status: "Data display",
    ready: true
  },
  {
    id: "unreleased",
    group: "patterns",
    title: "Unreleased page, not linked yet",
    icon: "folder",
    status: "Draft",
    ready: false
  }
];

export default function Example() {
  const columns: DataTableColumn<Page>[] = [
    {
      id: "title",
      header: "Page",
      grow: true,
      text: (row) => row.title,
      render: (row) => (
        <div className="flex min-w-0 items-center gap-2">
          <Icon name={row.icon} size="var(--v4-size-icon)" className="shrink-0" />
          <RowLink
            link={{ href: `/design-system/components/${row.group}/${row.id}` }}
            disabled={!row.ready}
            title={row.title}
          >
            {row.title}
          </RowLink>
        </div>
      )
    },
    {
      id: "status",
      header: "Group",
      width: 140,
      render: (row) => <Badge tone={row.ready ? "soft" : "warn"}>{row.status}</Badge>
    },
    {
      id: "actions",
      header: "Actions",
      actions: true,
      render: (row) => (
        <Button
          variant="ghost"
          size="icon-row"
          icon="copy"
          iconOnly
          onClick={() => navigator.clipboard.writeText(row.id)}
        >
          {`Copy the id of ${row.title}`}
        </Button>
      )
    }
  ];
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataTable
            label="Workbench pages"
            rows={pages}
            columns={columns}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.title}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"DataTable rows open their page; the last row is disabled"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed">
            <div className="flex items-center gap-3">
              <Icon name="apps" size="var(--v4-size-icon-xl)" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <RowLink
                  link={{ href: "/design-system/components/data-display/detail" }}
                  chevron={false}
                >
                  Detail
                </RowLink>
                <SmallText muted>
                  Stacked label and value pairs for the details of one resource.
                </SmallText>
              </div>
              <Button
                variant="ghost"
                size="icon-row"
                icon="copy"
                iconOnly
                onClick={() => navigator.clipboard.writeText("detail")}
              >
                Copy the id of Detail
              </Button>
            </div>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Card opens the Detail page without a chevron; the copy button keeps its own click"}
        </figcaption>
      </figure>
    </div>
  );
}
