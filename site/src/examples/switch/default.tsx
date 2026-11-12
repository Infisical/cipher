import { useState } from "react";

import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  const [events, setEvents] = useState(true);
  const [rotation, setRotation] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Switch label="Audit events" checked={events} onChange={setEvents} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Inline"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Switch
            label="Automatic rotation"
            description="Rotate credentials every 30 days."
            layout="row"
            checked={rotation}
            onChange={setRotation}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Row with description"}</figcaption>
      </figure>
    </div>
  );
}
