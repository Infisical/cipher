import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [value, setValue] = useState("/services/payments");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Draft path">
            <Input
              aria-label="Draft path"
              icon="search"
              mono
              kbd="⌘ K"
              trailing="path"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Filled"}</figcaption>
      </figure>
      <p role="status" className="sr-only text-sm break-all whitespace-pre-wrap" data-draft-value>
        {value}
      </p>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Native width hint" description="Short internal identifier.">
            <Input size={12} defaultValue="staging" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Filled"}</figcaption>
      </figure>
    </div>
  );
}
