import { useState } from "react";

import { Label } from "@infisical/cipher/ui/label";
import { RadioGroup, RadioGroupItem } from "@infisical/cipher/ui/radio-group";

export default function Example() {
  const [value, setValue] = useState("staging");
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-sm font-medium">Environment access</legend>
      <RadioGroup value={value} onValueChange={setValue} aria-label="Environment access">
        {["staging", "production", "archived"].map((environment) => (
          <div key={environment} className="flex items-center gap-3">
            <RadioGroupItem
              id={`radio-${environment}`}
              value={environment}
              disabled={environment === "archived"}
            />
            <Label htmlFor={`radio-${environment}`}>{environment}</Label>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
