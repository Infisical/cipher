import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";

export default function Example() {
  const [checked, setChecked] = useState(false);
  const [metadata, setMetadata] = useState(false);
  const [details, setDetails] = useState(false);
  const [archived, setArchived] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.DropdownMenu>
            <UI.DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Environment actions
              </Button>
            </UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent>
              <UI.DropdownMenuLabel>Staging</UI.DropdownMenuLabel>
              <UI.DropdownMenuItem onSelect={() => setDetails(!details)}>
                Connection details
              </UI.DropdownMenuItem>
              <UI.DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
                Show archived
              </UI.DropdownMenuCheckboxItem>
              <UI.DropdownMenuCheckboxItem
                checked={metadata}
                onCheckedChange={setMetadata}
                closeOnSelect
              >
                Show metadata and close
              </UI.DropdownMenuCheckboxItem>
              <UI.DropdownMenuSeparator />
              <UI.DropdownMenuItem disabled description="Turn off protection first">
                Delete protected environment
              </UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
          {details && <p className="text-sm">Staging connection</p>}
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.DropdownMenu>
            <UI.DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Archive actions
              </Button>
            </UI.DropdownMenuTrigger>
            <UI.DropdownMenuContent>
              <UI.DropdownMenuLabel>Staging</UI.DropdownMenuLabel>
              <UI.DropdownMenuItem variant="destructive" onSelect={() => setArchived(true)}>
                Archive environment
              </UI.DropdownMenuItem>
            </UI.DropdownMenuContent>
          </UI.DropdownMenu>
          {archived && (
            <p role="status" className="sr-only text-sm">
              Environment archived
            </p>
          )}
        </div>
        <figcaption className="text-muted-foreground text-xs">{"destructive"}</figcaption>
      </figure>
    </div>
  );
}
