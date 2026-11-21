import { useState } from "react";
import { Input } from "@infisical/cipher/ui/input";
import { Stack } from "@infisical/cipher/ui/layout";
import { List, ListRow } from "@infisical/cipher/ui/list";

const environments = ["Development", "Staging", "Production", "Production (EU) read replica"];

export default function Example() {
  const [query, setQuery] = useState("");
  const shown = environments.filter((name) =>
    name.toLowerCase().includes(query.trim().toLowerCase())
  );
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <Stack gap="toolbar">
        <Input
          icon="search"
          aria-label="Search environments"
          placeholder="Search environments"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <List label="Environments">
          {shown.map((name) => (
            <ListRow key={name} value={name} label={name} title={name} />
          ))}
        </List>
      </Stack>
      <figcaption className="text-muted-foreground text-xs">
        {'Stack gap="toolbar" puts 24px between a search row or FilterBar and the list it filters'}
      </figcaption>
    </figure>
  );
}
