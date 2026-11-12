import { useState } from "react";

import { Icon } from "@infisical/cipher/ui/icon";
import { Toggle } from "@infisical/cipher/ui/toggle";

export default function Example() {
  const [metadata, setMetadata] = useState(true);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Toggle>Metadata</Toggle>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Text, off"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Toggle pressed={metadata} onPressedChange={setMetadata}>
            Metadata
          </Toggle>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Text, on"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Toggle aria-label="Show values">
            <Icon name="eye" />
          </Toggle>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Icon, off"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Toggle aria-label="Show values" defaultPressed>
            <Icon name="eye" />
          </Toggle>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Icon, on"}</figcaption>
      </figure>
    </div>
  );
}
