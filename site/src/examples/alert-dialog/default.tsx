import { useState } from "react";

import { Alert, AlertDescription } from "@infisical/cipher/ui/alert";
import * as UI from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {(["Confirmation", "Pending", "Error"] as const).map((state) => (
        <figure
          key={state}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.AlertDialog
              open={open === state}
              onOpenChange={(next) => setOpen(next ? state : null)}
            >
              <UI.AlertDialogTrigger asChild>
                <Button variant="outline">Revoke access</Button>
              </UI.AlertDialogTrigger>
              <UI.AlertDialogContent tone="danger">
                <UI.AlertDialogHeader>
                  <UI.AlertDialogTitle>Revoke client access?</UI.AlertDialogTitle>
                  <UI.AlertDialogDescription>
                    This client will no longer read Staging secrets.
                  </UI.AlertDialogDescription>
                </UI.AlertDialogHeader>
                {state === "Error" && (
                  <Alert tone="bad">
                    <AlertDescription>Access could not be revoked. Try again.</AlertDescription>
                  </Alert>
                )}
                <UI.AlertDialogFooter>
                  <UI.AlertDialogCancel>Cancel</UI.AlertDialogCancel>
                  <UI.AlertDialogAction asChild>
                    <Button variant="destructive" loading={state === "Pending"}>
                      Revoke access
                    </Button>
                  </UI.AlertDialogAction>
                </UI.AlertDialogFooter>
              </UI.AlertDialogContent>
            </UI.AlertDialog>
          </div>
          <figcaption className="text-muted-foreground text-xs">{state}</figcaption>
        </figure>
      ))}
    </div>
  );
}
