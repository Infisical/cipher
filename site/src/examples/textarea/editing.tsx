import { useState } from "react";

import { Label } from "@infisical/cipher/ui/label";
import { Textarea } from "@infisical/cipher/ui/textarea";

export default function Example() {
  const [value, setValue] = useState(
    "Staging deployment notes.\nPreserve line breaks and exact values."
  );
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Label htmlFor="textarea-draft">Draft notes</Label>
          <Textarea
            id="textarea-draft"
            rows={5}
            cols={24}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <p
            role="status"
            className="sr-only text-sm break-all whitespace-pre-wrap"
            data-textarea-value
          >
            {value}
          </p>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Controlled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Label htmlFor="textarea-readonly">Saved notes</Label>
          <Textarea
            id="textarea-readonly"
            readOnly
            value={"Managed by platform policy.\nRetain this exact line break."}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Read-only"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Label htmlFor="textarea-empty">Empty notes</Label>
          <Textarea id="textarea-empty" placeholder="Describe this connection" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
    </div>
  );
}
