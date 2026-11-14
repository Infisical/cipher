import { useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";

const events = Array.from({ length: 40 }, (_, index) => `Secret rotated in staging (${index + 1})`);

export default function Example() {
  const [search, setSearch] = useState("rotated");
  const needle = search.trim().toLowerCase();
  const shown = events.filter((event) => event.toLowerCase().includes(needle));
  return (
    <div className="w-full max-w-md min-w-0">
      <Card
        variant="framed"
        title="Activity"
        action={
          <HeaderSearch
            label="Search activity"
            placeholder="Search activity"
            value={search}
            onValueChange={setSearch}
          />
        }
      >
        <div className="max-h-40 overflow-y-auto">
          {shown.map((event) => (
            <p key={event} className="m-0">
              {event}
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
