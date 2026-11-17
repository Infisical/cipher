import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Stack } from "@infisical/cipher/ui/layout";
import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  const [ssl, setSsl] = useState(true);
  return (
    <Stack gap={16} className="w-full">
      <Field label="Host">
        <Input defaultValue="orders-primary.internal.acme.dev" />
      </Field>
      <Field label="Port">
        <Input defaultValue="5432" />
      </Field>
      <Switch
        layout="row"
        label="SSL enabled"
        description="Encrypt the connection to the database."
        checked={ssl}
        onCheckedChange={setSsl}
      />
      <Field label="Username">
        <Input defaultValue="svc_orders_primary" />
      </Field>
    </Stack>
  );
}
