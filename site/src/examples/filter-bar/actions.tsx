import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";
import { Button } from "@infisical/cipher/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

const fields: FilterBarField[] = [
  {
    key: "actor",
    label: "Actor",
    type: "select",
    options: ["maya@example.com", "sam@example.com", "ci-deployer"].map((actor) => ({
      value: actor,
      label: actor
    }))
  },
  {
    key: "event",
    label: "Event",
    type: "multi-select",
    options: ["secret.read", "secret.update", "member.invite"].map((event) => ({
      value: event,
      label: event
    }))
  }
];

export default function Example() {
  const [filters, setFilters] = useState<FilterBarFilter[]>([
    { field: "event", values: ["secret.read", "secret.update"] }
  ]);
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("7d");
  return (
    <FilterBar
      label="Audit log filters"
      fields={fields}
      value={filters}
      onChange={setFilters}
      searchValue={search}
      onSearchChange={setSearch}
      searchLabel="Search events"
      actions={
        <>
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
          <Button variant="outline" icon="calendar">
            Custom
          </Button>
        </>
      }
    />
  );
}
