import { useEffect, useRef, useState } from "react";

import {
  FilterBar,
  type FilterBarField,
  type FilterBarFilter,
  type FilterBarOption
} from "@infisical/cipher/patterns/filter-bar";

const first = ["Ada", "Grace", "Alan", "Katherine", "Margaret", "Linus", "Barbara", "Ken"];
const last = ["Lovelace", "Hopper", "Turing", "Johnson", "Hamilton", "Torvalds", "Liskov"];
const people: FilterBarOption[] = Array.from({ length: 5000 }, (_, index) => ({
  value: `user-${index}`,
  label:
    index === 4321
      ? "Maximiliana Fernández-Oyelaran de la Vega Castellanos"
      : `${first[index % first.length]} ${last[Math.floor(index / first.length) % last.length]} ${index}`
}));
const projects: FilterBarOption[] = Array.from({ length: 2000 }, (_, index) => ({
  value: `project-${index}`,
  label:
    index === 1999
      ? "payments-platform-legacy-checkout-migration-eu-west"
      : `${["api", "web", "billing", "auth", "infra"][index % 5]}-service-${index}`
}));
const pageSize = 20;

const useServerOptions = (directory: readonly FilterBarOption[], selected: readonly string[]) => {
  const match = (query: string) =>
    directory
      .filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
      .slice(0, pageSize);
  const timer = useRef<number | undefined>(undefined);
  const [options, setOptions] = useState(() => [
    ...directory.filter((option) => selected.includes(option.value)),
    ...match("").filter((option) => !selected.includes(option.value))
  ]);
  const [loading, setLoading] = useState(false);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const onSearch = (query: string) => {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setOptions(match(query));
      setLoading(false);
    }, 500);
  };
  return { options, loading, onSearch };
};

const Bar = ({ initial, caption }: { initial: FilterBarFilter[]; caption: string }) => {
  const [filters, setFilters] = useState(initial);
  const valuesOf = (field: string) =>
    initial.find((filter) => filter.field === field)?.values ?? [];
  const owner = useServerOptions(people, valuesOf("owner"));
  const project = useServerOptions(projects, valuesOf("project"));
  const fields: FilterBarField[] = [
    { key: "owner", label: "Owner", type: "multi-select", ...owner },
    { key: "project", label: "Project", type: "select", ...project }
  ];
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <FilterBar label="Secret filters" fields={fields} value={filters} onChange={setFilters} />
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Bar
        initial={[]}
        caption="No filters: each field searches thousands of options on the server"
      />
      <Bar
        initial={[
          { field: "owner", values: ["user-3"] },
          { field: "project", values: ["project-12"] }
        ]}
        caption="One owner and one project applied"
      />
      <Bar
        initial={[
          { field: "owner", values: ["user-4321", "user-1200", "user-77", "user-3050"] },
          { field: "project", values: ["project-1999"] }
        ]}
        caption="Long labels and four owners applied"
      />
    </div>
  );
}
