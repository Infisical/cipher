import { useState } from "react";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [name, setName] = useState("");
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <Input
        aria-label="Honey token name"
        suggestedValue="honey-token-aws-7f3k"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input aria-label="Sync name" suggestedValue="aws-parameter-store-sync" />
      <Input aria-label="Read-only name" suggestedValue="generated-name" readOnly />
      <Input aria-label="Disabled name" suggestedValue="generated-name" disabled />
    </div>
  );
}
