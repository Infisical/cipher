import * as React from "react";

import { ListQueryScope } from "@infisical/cipher/lib/list-query";
import { FilterBar } from "@infisical/cipher/patterns/filter-bar";
import { Button } from "@infisical/cipher/ui/button";
import { DataTable } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";

type Connection = { id: string; name: string; app: string };

const columns = [
  { id: "name", header: "Name", render: (row: Connection) => row.name },
  { id: "app", header: "App", render: (row: Connection) => row.app }
];

function Connections({ all, initialSearch }: { all: Connection[]; initialSearch: string }) {
  const [search, setSearch] = React.useState(initialSearch);
  const query = search.trim().toLowerCase();
  const rows = all.filter((row) => row.name.toLowerCase().includes(query));
  return (
    <ListQueryScope>
      <div className="flex w-full min-w-0 flex-col gap-(--cipher-space-toolbar-gap)">
        <FilterBar
          label="App connections"
          searchLabel="Search connections"
          searchValue={search}
          onSearchChange={setSearch}
          slashShortcut={false}
        />
        <DataTable
          label="App connections"
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          rowLabel={(row) => row.name}
          empty={
            query ? (
              <EmptyState
                size="sm"
                media="bare"
                icon="search"
                title={`No app connections match "${search.trim()}"`}
                actions={
                  <Button variant="outline" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                }
              />
            ) : (
              <EmptyState
                size="sm"
                icon="apps"
                title="No app connections yet"
                actions={<Button>Add connection</Button>}
              />
            )
          }
        />
      </div>
    </ListQueryScope>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-2">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Connections all={[]} initialSearch="" />
        <figcaption className="text-muted-foreground text-xs">
          {"No search: ghost rows behind the first-run message"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Connections
          all={[
            { id: "1", name: "aws-production", app: "AWS" },
            { id: "2", name: "github-infisical", app: "GitHub" }
          ]}
          initialSearch="stripe-production-payments-eu-west"
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Searched: the FilterBar marks the list filtered, so no ghost"}
        </figcaption>
      </figure>
    </div>
  );
}
