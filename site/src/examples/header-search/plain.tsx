import { useEffect, useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";

const environments = ["Development", "Staging", "Production", "Preview", "QA", "Sandbox"];

function ClientCard() {
  const [search, setSearch] = useState("");
  const needle = search.trim().toLowerCase();
  const shown = environments.filter((name) => name.toLowerCase().includes(needle));
  return (
    <Card
      title="Environments"
      action={
        <HeaderSearch
          label="Search environments"
          placeholder="Search environments"
          value={search}
          onValueChange={setSearch}
          hint={shown.length ? undefined : `No environments match "${search.trim()}".`}
        />
      }
    >
      {shown.length ? shown.join(", ") : "No environments match."}
    </Card>
  );
}

const tags = ["billing", "backend", "frontend", "payments", "platform", "security", "web"];

function ServerCard() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState({ search, tags });
  useEffect(() => {
    const timer = setTimeout(() => {
      const needle = search.trim().toLowerCase();
      setResult({ search, tags: tags.filter((tag) => tag.includes(needle)) });
    }, 900);
    return () => clearTimeout(timer);
  }, [search]);
  const fetching = result.search !== search;
  return (
    <Card
      title="Secret tags"
      action={
        <HeaderSearch
          label="Search tags"
          placeholder="Search tags"
          debounceMs={250}
          pending={fetching}
          value={search}
          onValueChange={setSearch}
        />
      }
    >
      {result.tags.length ? result.tags.join(", ") : "No tags match."}
    </Card>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-x-6 gap-y-8">
      <ClientCard />
      <ServerCard />
    </div>
  );
}
