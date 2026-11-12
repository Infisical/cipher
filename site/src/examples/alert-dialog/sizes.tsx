import * as UI from "@infisical/cipher/ui/alert-dialog";
import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {(["default", "sm"] as const).map((size) => (
        <figure
          key={size}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.AlertDialog>
              <UI.AlertDialogTrigger asChild>
                <Button variant="outline">
                  {size === "sm" ? "Small confirmation" : "Default confirmation"}
                </Button>
              </UI.AlertDialogTrigger>
              <UI.AlertDialogContent size={size} tone="neutral" icon="folder">
                <UI.AlertDialogHeader>
                  <UI.AlertDialogTitle>Archive request details?</UI.AlertDialogTitle>
                  <UI.AlertDialogDescription>
                    Archived requests remain available in the audit log. Cancel to keep this request
                    open.
                  </UI.AlertDialogDescription>
                </UI.AlertDialogHeader>
                <UI.AlertDialogFooter>
                  <UI.AlertDialogCancel>Keep request</UI.AlertDialogCancel>
                  <UI.AlertDialogAction disabled>Archive unavailable</UI.AlertDialogAction>
                </UI.AlertDialogFooter>
              </UI.AlertDialogContent>
            </UI.AlertDialog>
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
