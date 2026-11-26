import { useState } from "react";

import { Combobox } from "@infisical/cipher/ui/combobox";

const environments = [
  { value: "dev", label: "Development", meta: "3 projects" },
  { value: "staging", label: "Staging", meta: "8 projects" },
  { value: "prod-eu", label: "Production EU Central", meta: "12 projects" }
];

export default function Example() {
  const [start, setStart] = useState("dev");
  const [end, setEnd] = useState("prod-eu");
  return (
    <div className="flex w-full min-w-0 items-start justify-between gap-6">
      <Combobox
        label="Source environment"
        width="xs"
        options={environments}
        value={start}
        onChange={setStart}
      />
      <Combobox
        label="Target environment"
        width="xs"
        align="end"
        options={environments}
        value={end}
        onChange={setEnd}
      />
    </div>
  );
}
