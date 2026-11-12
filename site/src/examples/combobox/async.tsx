import { useEffect, useRef, useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const catalog: ComboboxOption[] = [
  { value: "payments-api", label: "payments-api", meta: "Production" },
  { value: "payments-worker", label: "payments-worker", meta: "Production" },
  { value: "checkout-web", label: "checkout-web", meta: "Staging" },
  { value: "billing-cron", label: "billing-cron", meta: "Production" },
  { value: "ledger-service", label: "ledger-service", meta: "Development" },
  { value: "search-indexer", label: "search-indexer", meta: "Staging" },
  { value: "notifications", label: "notifications", meta: "Production" }
];
const match = (projects: readonly ComboboxOption[], query: string) =>
  projects
    .filter((project) => project.label.toLowerCase().includes(query.trim().toLowerCase()))
    .slice(0, 5);

export default function Example() {
  const projects = useRef(catalog);
  const timer = useRef<number | undefined>(undefined);
  const [options, setOptions] = useState(() => match(catalog, ""));
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const search = (query: string) => {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setOptions(match(projects.current, query));
      setLoading(false);
    }, 900);
  };
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Field
          label="Project"
          description="Results come from the host; the Combobox does not filter them."
        >
          <Combobox
            label="Project"
            placeholder="Choose a project"
            options={options}
            value={value}
            onChange={setValue}
            onSearch={search}
            loading={loading}
            emptyText="No projects match"
            onCreate={async (query, { signal }) => {
              await new Promise((resolve) => {
                setTimeout(resolve, 300);
              });
              if (signal.aborted) return;
              const created = { value: query, label: query, meta: "New" };
              projects.current = [...projects.current, created];
              setOptions(match(projects.current, query));
              setValue(query);
            }}
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Searches the server as you type"}
      </figcaption>
    </figure>
  );
}
