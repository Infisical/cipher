import { Button } from "@infisical/cipher/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@infisical/cipher/ui/card";
import { DataTable } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { Grid } from "@infisical/cipher/ui/layout";

type Connection = { id: string; name: string; app: string };

const columns = [
  { id: "name", header: "Name", render: (row: Connection) => row.name },
  { id: "app", header: "App", render: (row: Connection) => row.app }
];

const table = {
  label: "App connections",
  rows: [] as Connection[],
  columns,
  getRowId: (row: Connection) => row.id,
  rowLabel: (row: Connection) => row.name
};

const firstRun = (
  <EmptyState
    size="sm"
    icon="apps"
    title="No app connections yet"
    actions={<Button>Add connection</Button>}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataTable {...table} empty={firstRun} />
        <figcaption className="text-muted-foreground text-xs">
          {"First run: a DataTable draws ghost rows"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataTable
          {...table}
          filtered
          empty={
            <EmptyState
              size="sm"
              media="bare"
              icon="search"
              title={'No app connections match "stripe-production-payments-eu-west"'}
              actions={<Button variant="outline">Clear filters</Button>}
            />
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Filtered: no ghost, the empty table means no matches"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card variant="framed">
          <CardHeader>
            <CardTitle>App connections</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable {...table} empty={firstRun} />
          </CardContent>
        </Card>
        <figcaption className="text-muted-foreground text-xs">
          {"Flush in a framed Card: no ghost, there is no room for one"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Grid
          empty={
            <EmptyState
              size="sm"
              icon="folder"
              title="No projects yet"
              actions={<Button>Create project</Button>}
            />
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"First run: a Grid draws ghost cards"}
        </figcaption>
      </figure>
    </div>
  );
}
