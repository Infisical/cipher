import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@infisical/cipher/ui/dropdown-menu";
import { Item } from "@infisical/cipher/ui/item";
import { SortableList } from "@infisical/cipher/ui/sortable-list";
import { Switch } from "@infisical/cipher/ui/switch";

interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function Example() {
  const [rules, setRules] = React.useState<Rule[]>([
    { id: "seats", name: "Seat limit", description: "Blocks new members past 50 seats", enabled: true },
    { id: "trial", name: "Trial expiry", description: "Downgrades after 14 days", enabled: true },
    { id: "usage", name: "Usage overage", description: "Bills identities past the plan", enabled: false },
    { id: "grace", name: "Grace period", description: "Keeps access 7 days after a failed payment", enabled: true }
  ]);
  const toggle = (id: string, enabled: boolean) =>
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)));
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Evaluation order"
            action={
              <Button variant="outline" size="xs" icon="plus">
                Add rule
              </Button>
            }
          >
            <SortableList
              label="License rules"
              items={rules}
              getKey={(rule) => rule.id}
              getLabel={(rule) => rule.name}
              onReorder={setRules}
              renderItem={(rule, { index }) => (
                <Item
                  title={rule.name}
                  description={rule.description}
                  meta={`#${index + 1}`}
                  actions={
                    <>
                      <Switch
                        aria-label={`Enable ${rule.name}`}
                        checked={rule.enabled}
                        onChange={(enabled) => toggle(rule.id, enabled)}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-row" icon="more" iconOnly>
                            {`Actions for ${rule.name}`}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() =>
                              setRules((current) => current.filter((item) => item.id !== rule.id))
                            }
                          >
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  }
                />
              )}
            />
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Framed Card with a switch and a menu per row; only the grip starts a drag"}
        </figcaption>
      </figure>
    </div>
  );
}
