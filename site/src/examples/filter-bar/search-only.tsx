import { useState } from "react";

import { FilterBar } from "@infisical/cipher/patterns/filter-bar";
import { Meta } from "@infisical/cipher/ui/text";

const groups = ["Admins", "Billing", "Engineering", "Platform", "Support"];

export default function Example() {
  const [query, setQuery] = useState("");
  const shown = groups.filter((group) => group.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <FilterBar
          label="Group filters"
          searchLabel="Search groups"
          searchValue={query}
          onSearchChange={setQuery}
        />
        <Meta mono={false} role="status">
          {shown.join(", ") || "No groups match"}
        </Meta>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Search only: no fields, the bar renders its own search box"}
      </figcaption>
    </figure>
  );
}
