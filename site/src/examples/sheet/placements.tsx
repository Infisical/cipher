import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/sheet";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <figure
          key={side}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.Sheet>
              <UI.SheetTrigger asChild>
                <Button variant="outline">{side} sheet</Button>
              </UI.SheetTrigger>
              <UI.SheetContent side={side}>
                <UI.SheetHeader>
                  <UI.SheetTitle>Staging connection</UI.SheetTitle>
                  <UI.SheetDescription>
                    Read access, last synchronized 12 versions.
                  </UI.SheetDescription>
                </UI.SheetHeader>
                <UI.SheetFooter>
                  <UI.SheetClose asChild>
                    <Button variant="outline">Close connection</Button>
                  </UI.SheetClose>
                </UI.SheetFooter>
              </UI.SheetContent>
            </UI.Sheet>
          </div>
          <figcaption className="text-muted-foreground text-xs">{side}</figcaption>
        </figure>
      ))}
    </div>
  );
}
