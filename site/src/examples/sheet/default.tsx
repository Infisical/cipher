import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/sheet";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Sheet>
        <UI.SheetTrigger asChild>
          <Button variant="outline">Inspect connection</Button>
        </UI.SheetTrigger>
        <UI.SheetContent>
          <UI.SheetHeader>
            <UI.SheetTitle>Staging connection</UI.SheetTitle>
            <UI.SheetDescription>
              View the destination and synchronization status.
            </UI.SheetDescription>
          </UI.SheetHeader>
          <UI.SheetBody>
            <p>All 12 versions synchronized.</p>
          </UI.SheetBody>
          <UI.SheetFooter>
            <UI.SheetClose asChild>
              <Button>Close connection</Button>
            </UI.SheetClose>
          </UI.SheetFooter>
        </UI.SheetContent>
      </UI.Sheet>
    </div>
  );
}
