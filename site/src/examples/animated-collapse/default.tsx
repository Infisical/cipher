import { useState } from "react";

import { AnimatedCollapse } from "@infisical/cipher/ui/animated-collapse";
import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Button aria-expanded={open} aria-controls="advanced-settings" onClick={() => setOpen(!open)}>
        Advanced settings
      </Button>
      <AnimatedCollapse className="w-full" id="advanced-settings" open={open} lazy>
        <Field
          label="Retention note"
          description="This draft survives closing and reopening the region."
        >
          <Input defaultValue="Keep for 30 days" />
        </Field>
      </AnimatedCollapse>
    </div>
  );
}
