import { useState } from "react";

import * as UI from "@infisical/cipher/ui/hover-card";

const placements = [
  { side: "top", align: "start" },
  { side: "right", align: "center" },
  { side: "bottom", align: "end" },
  { side: "left", align: "center" }
] as const;
export default function Example() {
  const [selected, setSelected] = useState("");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {placements.map(({ side, align }) => (
        <figure
          key={side}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.HoverCard>
              <UI.HoverCardTrigger asChild>
                <a
                  href="#hover-card"
                  aria-label={`Staging connection / ${side} / ${align}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setSelected(`${side} / ${align}`);
                  }}
                >
                  Staging connection
                </a>
              </UI.HoverCardTrigger>
              <UI.HoverCardContent
                side={side}
                align={align}
                style={{ minWidth: 0, maxWidth: "var(--radix-hover-card-content-available-width)" }}
              >
                <p>Staging connection</p>
                <p>12 versions synchronized. Read access belongs to the Platform team.</p>
              </UI.HoverCardContent>
            </UI.HoverCard>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {
              <>
                {side} / {align}
              </>
            }
          </figcaption>
        </figure>
      ))}
      {selected && (
        <p role="status" className="sr-only">
          Staging connection selected locally, {selected}.
        </p>
      )}
    </div>
  );
}
