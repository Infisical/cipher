import { useState } from "react";

import * as UI from "@infisical/cipher/ui/hover-card";

export default function Example() {
  const [inspected, setInspected] = useState(false);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.HoverCard>
        <UI.HoverCardTrigger asChild>
          <a
            href="#hover-card"
            onClick={(event) => {
              event.preventDefault();
              setInspected(true);
            }}
          >
            Staging connection
          </a>
        </UI.HoverCardTrigger>
        <UI.HoverCardContent>
          <p>Last synchronized 12 versions.</p>
          <p>All clients are up to date.</p>
        </UI.HoverCardContent>
      </UI.HoverCard>
      {inspected && (
        <p role="status" className="sr-only mt-4">
          Staging connection selected in this local example.
        </p>
      )}
    </div>
  );
}
