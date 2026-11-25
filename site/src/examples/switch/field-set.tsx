import { useState } from "react";

import { Field, FieldSet } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  const [autoRenew, setAutoRenew] = useState(false);
  return (
    <FieldSet legend="Renewal" className="w-full">
      <Switch
        layout="row"
        label="Auto-renew"
        description="Renew certificates before they expire."
        checked={autoRenew}
        onCheckedChange={setAutoRenew}
      />
      {autoRenew && (
        <Field label="Renew before (days)">
          <Input width="xs" inputMode="numeric" defaultValue="30" />
        </Field>
      )}
    </FieldSet>
  );
}
