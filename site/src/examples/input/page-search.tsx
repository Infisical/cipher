import { useState } from "react";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [search, setSearch] = useState("");
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <Input
        type="search"
        icon="search"
        aria-label="Search data sources"
        placeholder="Search data sources"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slashShortcut
      />
      <Input aria-label="Notes" placeholder="Typing / here stays in this field" />
    </div>
  );
}
