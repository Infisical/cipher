import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";
import { Meta } from "@infisical/cipher/ui/text";

const fields: FilterBarField[] = [
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "expired", label: "Expired" },
      { value: "revoked", label: "Revoked" }
    ]
  },
  {
    key: "product",
    label: "Product",
    type: "multi-select",
    options: [
      { value: "secrets", label: "Secrets Management" },
      { value: "pki", label: "Certificate Manager" },
      { value: "pam", label: "PAM" }
    ]
  }
];

export default function Example() {
  const [query, setQuery] = useState(() => new URLSearchParams("status=active"));
  const value: FilterBarFilter[] = fields
    .filter((field) => query.has(field.key))
    .map((field) => ({ field: field.key, values: query.getAll(field.key) }));
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <FilterBar
          label="License filters"
          fields={fields}
          value={value}
          onChange={(next) => {
            const params = new URLSearchParams();
            for (const filter of next)
              for (const entry of filter.values) params.append(filter.field, entry);
            setQuery(params);
          }}
        />
        <Meta role="status">{`?${query.toString()}`}</Meta>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Filters kept in a query string, which holds only chosen values"}
      </figcaption>
    </figure>
  );
}
