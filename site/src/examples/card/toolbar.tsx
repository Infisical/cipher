import { useState } from "react";

import { FilterBar, type FilterBarFilter } from "@infisical/cipher/patterns/filter-bar";
import { Card } from "@infisical/cipher/ui/card";
import { DataTable, type DataTableColumn } from "@infisical/cipher/ui/data-table";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

type Event = { id: string; event: string; actor: string; time: string };

const events: Event[] = [
  { id: "1", event: "secret.update", actor: "maya@example.com", time: "10:42" },
  { id: "2", event: "secret.read", actor: "ci-deployer", time: "10:31" },
  { id: "3", event: "member.invite", actor: "sam@example.com", time: "09:58" }
];

const columns: DataTableColumn<Event>[] = [
  {
    id: "event",
    header: "Event",
    primary: true,
    grow: true,
    mono: true,
    render: (row) => row.event
  },
  { id: "actor", header: "Actor", render: (row) => row.actor },
  { id: "time", header: "Time", width: 80, render: (row) => row.time }
];

function AuditCard({ rows }: { rows: Event[] }) {
  const [filters, setFilters] = useState<FilterBarFilter[]>([]);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("7d");
  const actors = filters.flatMap((filter) => filter.values);
  const query = search.trim().toLowerCase();
  const visible = rows.filter(
    (row) =>
      (actors.length === 0 || actors.includes(row.actor)) &&
      (!query || `${row.event} ${row.actor}`.toLowerCase().includes(query))
  );
  return (
    <Card
      variant="framed"
      title="Audit logs"
      toolbar={
        <FilterBar
          label="Audit log filters"
          fields={[
            {
              key: "actor",
              label: "Actor",
              type: "select",
              options: events.map((event) => ({ value: event.actor, label: event.actor }))
            }
          ]}
          value={filters}
          onChange={setFilters}
          searchValue={search}
          onSearchChange={setSearch}
          searchLabel="Search events"
          slashShortcut={false}
          actions={
            <ToggleGroup
              type="single"
              aria-label="Date range"
              value={range}
              onValueChange={(next) => next && setRange(next)}
            >
              <ToggleGroupItem value="1d">24h</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 days</ToggleGroupItem>
            </ToggleGroup>
          }
        />
      }
    >
      <DataTable
        label="Audit log"
        rows={visible}
        columns={columns}
        getRowId={(row) => row.id}
        rowLabel={(row) => `${row.event} by ${row.actor}`}
        empty={<EmptyState size="sm" icon="history" title="No events in this range" />}
      />
    </Card>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-8">
      <AuditCard rows={events} />
      <AuditCard rows={[]} />
    </div>
  );
}
