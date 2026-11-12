import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";

const placements = [
  { side: "top", align: "start" },
  { side: "right", align: "center" },
  { side: "bottom", align: "end" },
  { side: "left", align: "center" }
] as const;
export default function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {placements.map(({ side, align }) => (
        <figure
          key={side}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.DropdownMenu>
              <UI.DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Open menu
                </Button>
              </UI.DropdownMenuTrigger>
              <UI.DropdownMenuContent side={side} align={align}>
                <UI.DropdownMenuItem onSelect={() => setSelected(true)}>
                  Connection details
                </UI.DropdownMenuItem>
                <UI.DropdownMenuItem disabled>Delete locked environment</UI.DropdownMenuItem>
              </UI.DropdownMenuContent>
            </UI.DropdownMenu>
          </div>
          <figcaption className="text-muted-foreground text-xs">{`${side} / ${align}`}</figcaption>
        </figure>
      ))}
      {selected && (
        <p role="status" className="sr-only">
          Staging connection: vault.example.test
        </p>
      )}
    </div>
  );
}
