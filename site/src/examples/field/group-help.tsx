import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Checkbox } from "@infisical/cipher/ui/checkbox";
import { Field, FieldGroup, FieldSet } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [bands, setBands] = useState(["0", "1000"]);
  return (
    <FieldGroup>
      <Field
        label="Notify on"
        group
        help="Events go to every channel on the project."
        description="Choose which changes send an alert."
      >
        <div className="space-y-3">
          <Checkbox label="Secret changes" defaultChecked />
          <Checkbox label="Access requests" />
        </div>
      </Field>
      <FieldSet
        legend="Bands"
        legendVariant="label"
        description="Each band prices the units above its starting count."
        help="A band applies from its start until the next band begins."
        actions={
          <Button
            size="xs"
            variant="outline"
            icon="plus"
            disabled={bands.length >= 4}
            onClick={() => setBands((current) => [...current, ""])}
          >
            Add band
          </Button>
        }
      >
        {bands.map((start, index) => (
          <Field key={index} label={`Band ${index + 1} starts at`}>
            <Input
              mono
              inputMode="numeric"
              value={start}
              onChange={(event) =>
                setBands((current) =>
                  current.map((entry, at) => (at === index ? event.target.value : entry))
                )
              }
            />
          </Field>
        ))}
      </FieldSet>
    </FieldGroup>
  );
}
