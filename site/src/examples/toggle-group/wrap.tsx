import { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

const scopes = [
  { value: "read", label: "Read secrets" },
  { value: "write", label: "Create and update secrets" },
  { value: "delete", label: "Delete secrets" },
  { value: "folders", label: "Manage folders and imports" },
  { value: "rotate", label: "Rotate credentials" },
  { value: "environments", label: "Administer environments" }
];

export default function Example() {
  const [values, setValues] = useState(["read", "write", "folders"]);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <ToggleGroup
          type="multiple"
          value={values}
          onValueChange={setValues}
          aria-label="Secret permissions"
        >
          {scopes.map((scope) => (
            <ToggleGroupItem key={scope.value} value={scope.value}>
              {scope.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"multiple, wraps onto more rows when it runs out of width"}
      </figcaption>
    </figure>
  );
}
