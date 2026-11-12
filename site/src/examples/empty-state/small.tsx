import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { EmptyState } from "@infisical/cipher/ui/empty";
import { List, ListRow } from "@infisical/cipher/ui/list";

const secrets = ["DATABASE_URL", "REDIS_URL", "SESSION_KEY"];

export default function Example() {
  const [query, setQuery] = useState("stripe_web");
  const rows = secrets.filter((name) => name.toLowerCase().includes(query));
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <List
          label="Staging secrets"
          title="Staging secrets"
          empty={
            <EmptyState
              size="sm"
              icon="search"
              title={`No secrets match “${query}”`}
              actions={
                <Button variant="link" onClick={() => setQuery("")}>
                  Clear filter
                </Button>
              }
            />
          }
        >
          {rows.map((name) => (
            <ListRow key={name} value={name} label={name} title={name} />
          ))}
        </List>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"sm"}</figcaption>
    </figure>
  );
}
