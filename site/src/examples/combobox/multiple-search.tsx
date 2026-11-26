import { useEffect, useRef, useState } from "react";

import { Combobox, type ComboboxOption } from "@infisical/cipher/ui/combobox";
import { Field } from "@infisical/cipher/ui/field";

const first = [
  "Ada",
  "Grace",
  "Alan",
  "Katherine",
  "Margaret",
  "Linus",
  "Barbara",
  "Ken",
  "Radia",
  "Frances"
];
const last = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Johnson",
  "Hamilton",
  "Torvalds",
  "Liskov",
  "Thompson",
  "Perlman",
  "Allen"
];
const directory: ComboboxOption[] = Array.from({ length: 500 }, (_, index) => ({
  value: `user-${index}`,
  label:
    index === 437
      ? "Maximiliana Fernández-Oyelaran de la Vega"
      : `${first[index % 10]} ${last[Math.floor(index / 10) % 10]}${index >= 100 ? ` ${Math.floor(index / 100) + 1}` : ""}`,
  description: `user${index}@example.com`
}));
const pageSize = 20;
const initial = ["user-3", "user-12", "user-437"];
const match = (query: string) =>
  directory
    .filter((user) =>
      `${user.label} ${user.description}`.toLowerCase().includes(query.trim().toLowerCase())
    )
    .slice(0, pageSize);

export default function Example() {
  const timer = useRef<number | undefined>(undefined);
  const [options, setOptions] = useState(() => [
    ...directory.filter((user) => initial.includes(user.value)),
    ...match("").filter((user) => !initial.includes(user.value))
  ]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initial);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const search = (query: string) => {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setOptions(match(query));
      setLoading(false);
    }, 600);
  };
  return (
    <div className="w-full max-w-md min-w-0">
      <Field label="Members" description={`Searches 500 people, ${pageSize} results at a time.`}>
        <Combobox
          multiple
          label="Members"
          placeholder="Add members"
          searchPlaceholder="Search by name or email"
          options={options}
          value={value}
          onChange={setValue}
          onSearch={search}
          loading={loading}
          emptyText="No people match"
          clearable
        />
      </Field>
    </div>
  );
}
