import * as React from "react";

import { Item } from "@infisical/cipher/ui/item";
import { SortableList } from "@infisical/cipher/ui/sortable-list";

const initial = [
  { id: "development", name: "Development", slug: "dev" },
  { id: "staging", name: "Staging", slug: "staging" },
  { id: "qa", name: "QA", slug: "qa" },
  { id: "production", name: "Production", slug: "prod" }
];

export default function Example() {
  const [environments, setEnvironments] = React.useState(initial);
  const [plans, setPlans] = React.useState([
    { id: "free", name: "Free", locked: true },
    { id: "pro", name: "Pro", locked: false },
    { id: "enterprise", name: "Enterprise", locked: false }
  ]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SortableList
            label="Environments"
            items={environments}
            getKey={(environment) => environment.id}
            getLabel={(environment) => environment.name}
            onReorder={setEnvironments}
            renderItem={(environment) => (
              <Item size="sm" title={environment.name} meta={environment.slug} />
            )}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {`Order: ${environments.map((environment) => environment.name).join(", ")}`}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <SortableList
            label="Plans"
            size="sm"
            items={plans}
            getKey={(plan) => plan.id}
            getLabel={(plan) => plan.name}
            isItemDisabled={(plan) => plan.locked}
            onReorder={setPlans}
            renderItem={(plan) => <Item size="sm" title={plan.name} />}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"sm, Free is locked"}</figcaption>
      </figure>
    </div>
  );
}
