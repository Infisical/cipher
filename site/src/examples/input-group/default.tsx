import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Icon } from "@infisical/cipher/ui/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@infisical/cipher/ui/input-group";

export default function Example() {
  const [query, setQuery] = useState("payments");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Filter secrets">
            <InputGroup>
              <InputGroupAddon>
                <Icon name="search" />
              </InputGroupAddon>
              <InputGroupInput value={query} onChange={(event) => setQuery(event.target.value)} />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={() => setQuery("")} disabled={!query}>
                  Clear
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Editable with clear action"}
        </figcaption>
      </figure>
      <p role="status" className="sr-only text-sm">
        Filter: {query || "all secrets"}
      </p>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Required path" error="Choose an absolute path.">
            <InputGroup invalid>
              <InputGroupInput defaultValue="relative" />
            </InputGroup>
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Invalid"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Managed path">
            <InputGroup>
              <InputGroupInput readOnly value="/policy" />
            </InputGroup>
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Read-only"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Unavailable path">
            <InputGroup>
              <InputGroupInput disabled defaultValue="/archived" />
            </InputGroup>
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
