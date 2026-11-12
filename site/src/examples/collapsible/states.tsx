import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@infisical/cipher/ui/collapsible";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  const [open, setOpen] = useState(true);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline">Connection note</Button>
            </CollapsibleTrigger>
            <CollapsibleContent forceMount hidden={!open}>
              <div className="pt-3">
                <Input aria-label="Connection note" defaultValue="Keep for 30 days" />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Controlled, retained draft"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Collapsible disabled>
            <CollapsibleTrigger asChild>
              <Button variant="outline">Managed by policy</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>Managed by administrators.</CollapsibleContent>
          </Collapsible>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
