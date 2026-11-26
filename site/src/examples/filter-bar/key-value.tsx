import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";

const fields: FilterBarField[] = [
  {
    key: "metadata",
    label: "Metadata",
    type: "key-value",
    keyPlaceholder: "Key",
    valuePlaceholder: "Value",
    max: 20
  },
  { key: "name", label: "Name", type: "text", placeholder: "Part of a name" }
];

const Bar = ({ initial }: { initial: FilterBarFilter[] }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState("");
  return (
    <FilterBar
      label="Secrets"
      fields={fields}
      value={filters}
      onChange={setFilters}
      searchValue={query}
      onSearchChange={setQuery}
      searchLabel="Search secrets"
      slashShortcut={false}
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Bar initial={[]} />
      <Bar initial={[{ field: "metadata", values: ["env", "prod", "team", "payments"] }]} />
      <Bar
        initial={[
          {
            field: "metadata",
            values: [
              "kubernetes.io/service-account.namespace",
              "payments-reconciliation-worker-eu-west-1-production",
              "team",
              "payments",
              "rotation",
              "quarterly"
            ]
          },
          { field: "name", values: ["DATABASE_CONNECTION_STRING_READ_REPLICA"] }
        ]}
      />
    </div>
  );
}
