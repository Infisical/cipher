import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { CommandMenu } from "@infisical/cipher/ui/command-menu";

export default function Example() {
  const [open, setOpen] = useState<"loading" | "empty" | null>(null);
  const close = (next: boolean) => {
    if (!next) setOpen(null);
  };
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Button variant="outline" onClick={() => setOpen("loading")}>
            Open palette
          </Button>
          <CommandMenu
            hotkey={false}
            filter={false}
            loading
            label="Loading connections"
            groups={[]}
            open={open === "loading"}
            onOpenChange={close}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading results"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Button variant="outline" onClick={() => setOpen("empty")}>
            Open palette
          </Button>
          <CommandMenu
            hotkey={false}
            filter={false}
            label="Search connections"
            groups={[]}
            emptyHint="Enter a connection name."
            open={open === "empty"}
            onOpenChange={close}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"No results"}</figcaption>
      </figure>
    </div>
  );
}
