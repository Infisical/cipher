import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [name, setName] = useState("payments-api");
  const [saved, setSaved] = useState(0);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved((count) => count + 1);
          }}
        >
          <Field label="Identity name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setName(`identity-${Date.now() % 10000}`)}
            >
              Generate name
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save
            </Button>
            <span role="status" className="text-sm">
              {saved ? `Saved ${saved} ${saved === 1 ? "time" : "times"}` : "Not saved yet"}
            </span>
          </div>
        </form>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Generate keeps the default type; Save sets type submit"}
      </figcaption>
    </figure>
  );
}
