import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";
import { Input } from "@infisical/cipher/ui/input";
import { Meta } from "@infisical/cipher/ui/text";

type Event = { action: string; actor: string; date: string };
const events: Event[] = [
  { action: "secret.update", actor: "maya@acme.dev", date: "2026-11-11" },
  { action: "secret.read", actor: "ci-deployer", date: "2026-11-09" },
  { action: "member.invite", actor: "maya@acme.dev", date: "2026-11-04" },
  { action: "secret.delete", actor: "sam@acme.dev", date: "2026-10-28" },
  { action: "identity.create", actor: "sam@acme.dev", date: "2026-10-15" }
];
const fields: FilterBarField[] = [
  { key: "date", label: "Date", type: "date-range", defaultMonth: new Date(2026, 10, 1) },
  {
    key: "actor",
    label: "Actor",
    type: "select",
    options: ["maya@acme.dev", "sam@acme.dev", "ci-deployer"].map((actor) => ({
      value: actor,
      label: actor
    }))
  }
];
const matches = (event: Event, filter: FilterBarFilter) => {
  if (filter.field === "date") {
    const [from, to] = filter.values;
    return !from || !to || (event.date >= from && event.date <= to);
  }
  return !filter.values[0] || event.actor === filter.values[0];
};

export default function Example() {
  const [filters, setFilters] = useState<FilterBarFilter[]>([
    { field: "date", values: ["2026-11-03", "2026-11-12"] }
  ]);
  const [query, setQuery] = useState("");
  const shown = events.filter(
    (event) =>
      event.action.includes(query.trim().toLowerCase()) &&
      filters.every((filter) => matches(event, filter))
  );
  return (
    <div className="flex w-full min-w-0 flex-col items-stretch gap-3">
      <FilterBar
        label="Event filters"
        fields={fields}
        value={filters}
        onChange={setFilters}
        search={
          <Input
            icon="search"
            aria-label="Search events"
            placeholder="Search events"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        }
      />
      <Meta
        mono={false}
        role="status"
      >{`${shown.length} of ${events.length} events: ${shown.map((event) => event.action).join(", ") || "none"}`}</Meta>
    </div>
  );
}
