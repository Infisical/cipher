import { useEffect, useRef, useState } from "react";

import * as UI from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [open, setOpen] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.AlertDialog
            open={open === "danger"}
            onOpenChange={(next) => setOpen(next ? "danger" : null)}
          >
            <UI.AlertDialogTrigger asChild>
              <Button variant="outline">Delete project</Button>
            </UI.AlertDialogTrigger>
            <UI.AlertDialogContent tone="danger" confirmText="payments-api">
              <UI.AlertDialogHeader>
                <UI.AlertDialogTitle>Delete payments-api?</UI.AlertDialogTitle>
                <UI.AlertDialogDescription>
                  All 52 secrets, 9 environments and their history are removed. This cannot be
                  undone.
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
                      setOpen(null);
                    }, 1500);
                  }}
                >
                  Delete project
                </UI.AlertDialogAction>
              </UI.AlertDialogFooter>
            </UI.AlertDialogContent>
          </UI.AlertDialog>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {deleting ? "danger, deleting" : "danger"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.AlertDialog
            open={open === "neutral"}
            onOpenChange={(next) => setOpen(next ? "neutral" : null)}
          >
            <UI.AlertDialogTrigger asChild>
              <Button variant="outline">Rotate key</Button>
            </UI.AlertDialogTrigger>
            <UI.AlertDialogContent tone="neutral">
              <UI.AlertDialogHeader>
                <UI.AlertDialogTitle>Rotate the signing key?</UI.AlertDialogTitle>
                <UI.AlertDialogDescription>
                  Clients pick up the new key on their next request.
                </UI.AlertDialogDescription>
              </UI.AlertDialogHeader>
              <UI.AlertDialogFooter>
                <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
                <UI.AlertDialogAction>Rotate key</UI.AlertDialogAction>
              </UI.AlertDialogFooter>
            </UI.AlertDialogContent>
          </UI.AlertDialog>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"neutral"}</figcaption>
      </figure>
    </div>
  );
}
