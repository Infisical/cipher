import { useEffect, useRef, useState } from "react";

import * as UI from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  let label = "Ready";
  if (deleting) label = "Deleting";
  else if (deleted) label = "Deleted in this local example";
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <UI.AlertDialog open={open} onOpenChange={setOpen}>
          <UI.AlertDialogTrigger asChild>
            <Button variant="outline">Delete connection</Button>
          </UI.AlertDialogTrigger>
          <UI.AlertDialogContent tone="danger">
            <UI.AlertDialogHeader>
              <UI.AlertDialogTitle>Delete production-postgres?</UI.AlertDialogTitle>
              <UI.AlertDialogDescription>
                Syncs and rotations that use this connection stop.
              </UI.AlertDialogDescription>
            </UI.AlertDialogHeader>
            <UI.AlertDialogFooter>
              <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
              <UI.AlertDialogAction
                variant="destructive"
                loading={deleting}
                onClick={() => {
                  setDeleting(true);
                  timer.current = window.setTimeout(() => {
                    setDeleting(false);
                    setDeleted(true);
                    setOpen(false);
                  }, 2000);
                }}
              >
                Delete connection
              </UI.AlertDialogAction>
            </UI.AlertDialogFooter>
          </UI.AlertDialogContent>
        </UI.AlertDialog>
      </div>
      <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
    </figure>
  );
}
