import { useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter
} from "@infisical/cipher/patterns/filter-bar";

import { placeholderMedia } from "../placeholder-media";

const connections = [
  { value: "storage", label: "Object storage", media: placeholderMedia.square },
  { value: "queue", label: "Message queue", media: placeholderMedia.circle },
  { value: "registry", label: "Container registry", media: placeholderMedia.triangle },
  {
    value: "long",
    label: "Shared object storage for every production region and its disaster recovery copies",
    media: placeholderMedia.diamond
  }
];
const fields: FilterBarField[] = [
  { key: "connection", label: "Connection", type: "select", options: connections },
  { key: "sources", label: "Source", type: "multi-select", options: connections }
];

const Bar = ({ initial, caption }: { initial: FilterBarFilter[]; caption: string }) => {
  const [filters, setFilters] = useState(initial);
  const [query, setQuery] = useState("");
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <FilterBar
        label="Sync filters"
        fields={fields}
        value={filters}
        onChange={setFilters}
        searchValue={query}
        onSearchChange={setQuery}
        searchLabel="Search syncs"
      />
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Bar initial={[]} caption="No filters" />
      <Bar
        initial={[{ field: "connection", values: ["storage"] }]}
        caption="The chosen option's media leads the value in the chip"
      />
      <Bar
        initial={[
          { field: "connection", values: ["long"] },
          { field: "sources", values: ["long", "queue", "registry"] }
        ]}
        caption="Long values truncate; the media keeps its size"
      />
    </div>
  );
}
