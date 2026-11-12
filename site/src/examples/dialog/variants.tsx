import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.Dialog>
            <UI.DialogTrigger asChild>
              <Button variant="outline">Corner close</Button>
            </UI.DialogTrigger>
            <UI.DialogContent>
              <UI.DialogHeader>
                <UI.DialogTitle>Environment details</UI.DialogTitle>
                <UI.DialogDescription>Read-only details for Staging.</UI.DialogDescription>
              </UI.DialogHeader>
              <p>Region: eu-west-1. Access: Platform team.</p>
            </UI.DialogContent>
          </UI.Dialog>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Corner close, for read-only or informational dialogs"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <UI.Dialog>
            <UI.DialogTrigger asChild>
              <Button variant="outline">Footer close</Button>
            </UI.DialogTrigger>
            <UI.DialogContent showCloseButton={false}>
              <UI.DialogHeader>
                <UI.DialogTitle>Environment details</UI.DialogTitle>
                <UI.DialogDescription>Read-only details for Staging.</UI.DialogDescription>
              </UI.DialogHeader>
              <p>Region: eu-west-1. Access: Platform team.</p>
              <UI.DialogFooter showCloseButton />
            </UI.DialogContent>
          </UI.Dialog>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Footer close, when the dialog ends in actions"}
        </figcaption>
      </figure>
    </div>
  );
}
