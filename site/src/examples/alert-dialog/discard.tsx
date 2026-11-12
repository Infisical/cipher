import { useState } from "react";

import { DiscardChangesAlertDialog } from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [discarded, setDiscarded] = useState(0);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Close Draft
        </Button>
        <DiscardChangesAlertDialog
          open={open}
          onOpenChange={setOpen}
          onDiscard={() => {
            setDiscarded((count) => count + 1);
            setOpen(false);
          }}
          description="Your unsaved changes to this skill will be lost."
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{`Discarded ${discarded} ${discarded === 1 ? "draft" : "drafts"}`}</figcaption>
    </figure>
  );
}
