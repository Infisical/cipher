import { useEffect, useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { MultiSelect, type MultiSelectOption } from "@infisical/cipher/ui/multi-select";

const directory: MultiSelectOption[] = [
  "Ada Lovelace",
  "Grace Hopper",
  "Alan Turing",
  "Katherine Johnson",
  "Margaret Hamilton",
  "Linus Torvalds",
  "Barbara Liskov",
  "Ken Thompson",
  "Dennis Ritchie",
  "Frances Allen",
  "Maximiliana Fernández-Oyelaran de la Vega (Platform Engineering, EU West)",
  "Radia Perlman"
].map((name, index) => ({
  value: `user-${index}`,
  label: name,
  description: `${name.split(" ")[0].toLowerCase()}@example.com`
}));

export default function Example() {
  const [members, setMembers] = useState(["user-0", "user-1"]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(directory.slice(0, 5));
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(
        directory
          .filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      );
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);
  return (
    <div className="w-full max-w-sm min-w-0">
      <Field label="Members" description="Results load from the server as you type.">
        <MultiSelect
          label="Members"
          options={results}
          value={members}
          onChange={setMembers}
          onSearch={setQuery}
          loading={loading}
        />
      </Field>
    </div>
  );
}
