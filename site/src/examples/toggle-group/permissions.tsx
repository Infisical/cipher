import { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@infisical/cipher/ui/toggle-group";

export default function Example() {
  const [values, setValues] = useState(["read", "admin"]);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <ToggleGroup
          type="multiple"
          value={values}
          onValueChange={setValues}
          aria-label="Permission flags"
        >
          <ToggleGroupItem value="read" aria-label="Read permission">
            Read
          </ToggleGroupItem>
          <ToggleGroupItem value="write" aria-label="Write permission">
            Write
          </ToggleGroupItem>
          <ToggleGroupItem value="admin" aria-label="Administrator permission" disabled>
            Admin
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"multiple"}</figcaption>
    </figure>
  );
}
