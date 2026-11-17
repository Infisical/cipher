import { Button } from "@infisical/cipher/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@infisical/cipher/ui/card";
import { DataTable } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

type Connection = { id: string; name: string; app: string };

const columns = [
  { id: "name", header: "Name", render: (row: Connection) => row.name },
  { id: "app", header: "App", render: (row: Connection) => row.app }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataTable
          label="App connections"
          rows={[] as Connection[]}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.name}
          empty={
            <EmptyState
              ghost="rows"
              size="sm"
              icon="apps"
              title="No app connections yet"
              actions={<Button>Add connection</Button>}
            />
          }
        />
        <figcaption className="text-muted-foreground text-xs">{"Rows inside a table"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <EmptyState
          ghost="rows"
          size="sm"
          icon="apps"
          title="No app connections yet"
          actions={<Button>Add connection</Button>}
        />
        <figcaption className="text-muted-foreground text-xs">{"Rows on a page"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card variant="framed">
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              ghost="cards"
              size="sm"
              icon="folder"
              title="No projects yet"
              actions={<Button>Create project</Button>}
            />
          </CardContent>
        </Card>
        <figcaption className="text-muted-foreground text-xs">{"Cards inside a frame"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <EmptyState
          ghost="cards"
          size="sm"
          icon="folder"
          title="No projects match these filters, try clearing them or creating a new project"
          actions={
            <>
              <Button variant="outline">Clear filters</Button>
              <Button>Create project</Button>
            </>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Cards on a page, with a long title and two actions"}
        </figcaption>
      </figure>
    </div>
  );
}
