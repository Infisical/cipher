import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";

const fields: FilterBarField[] = [
  { key: "org", label: "Org ID", type: "text", placeholder: "Exact org ID", verb: "is" },
  { key: "customer", label: "Customer", type: "text", placeholder: "Part of a name" }
];

const Bar = ({ initial }: { initial: FilterBarFilter[] }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState("");
  return (
    <FilterBar
      label="Licenses"
      fields={fields}
      value={filters}
      onChange={setFilters}
      searchValue={query}
      onSearchChange={setQuery}
      searchLabel="Search licenses"
      slashShortcut={false}
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Bar initial={[]} />
      <Bar initial={[{ field: "org", values: ["org_9f2c41"] }]} />
      <Bar
        initial={[
          { field: "org", values: ["org_9f2c41d7-3b8e-4a6f-a1c2-7e5d0b9f8a34-eu-west-production"] },
          { field: "customer", values: ["Acme payments"] }
        ]}
      />
    </div>
  );
}
