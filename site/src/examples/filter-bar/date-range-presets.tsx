import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";
import type { DateRangePreset } from "@infisical/cipher/ui/date-range-picker";

const today = new Date();
today.setHours(0, 0, 0, 0);
const ahead = (days: number, months = 0) =>
  new Date(today.getFullYear(), today.getMonth() + months, today.getDate() + days);
const presets: DateRangePreset[] = [
  { label: "Next 7 days", range: { from: today, to: ahead(7) } },
  { label: "Next 30 days", range: { from: today, to: ahead(30) } },
  { label: "Next 3 months", range: { from: today, to: ahead(0, 3) } },
  { label: "Next 6 months", range: { from: today, to: ahead(0, 6) } },
  { label: "Next 12 months", range: { from: today, to: ahead(0, 12) } }
];
const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const fields: FilterBarField[] = [
  { key: "expires", label: "Expires", type: "date-range", presets, numberOfMonths: 2 },
  {
    key: "type",
    label: "Type",
    type: "multi-select",
    options: [
      { value: "certificate", label: "Certificate" },
      { value: "secret", label: "Secret" }
    ]
  }
];

export default function Example() {
  const [filters, setFilters] = useState<FilterBarFilter[]>([
    { field: "expires", values: [iso(today), iso(ahead(30))] }
  ]);
  const [query, setQuery] = useState("");
  return (
    <FilterBar
      label="Expiry filters"
      fields={fields}
      value={filters}
      onChange={setFilters}
      searchLabel="Search certificates"
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
}
