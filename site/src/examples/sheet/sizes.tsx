import { Button } from "@infisical/cipher/ui/button";
import { Field, FieldGroup } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import * as UI from "@infisical/cipher/ui/sheet";

const sizes = ["sm", "md", "lg"] as const;

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {sizes.map((size) => (
        <figure
          key={size}
          className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
        >
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <UI.Sheet>
              <UI.SheetTrigger asChild>
                <Button variant="outline">{size} sheet</Button>
              </UI.SheetTrigger>
              <UI.SheetContent size={size}>
                <UI.SheetHeader>
                  <UI.SheetTitle>Staging connection</UI.SheetTitle>
                  <UI.SheetDescription>
                    Edit the name and access key for this connection.
                  </UI.SheetDescription>
                </UI.SheetHeader>
                <UI.SheetBody>
                  <FieldGroup>
                    <Field label="Connection name" wide>
                      <Input defaultValue="aws-staging-keys" />
                    </Field>
                    <Field label="Access key ID" description="Shown in activity logs." wide>
                      <Input defaultValue="AKIAEXAMPLESTAGING01" />
                    </Field>
                  </FieldGroup>
                </UI.SheetBody>
                <UI.SheetFooter>
                  <UI.SheetClose asChild>
                    <Button variant="outline">Close connection</Button>
                  </UI.SheetClose>
                </UI.SheetFooter>
              </UI.SheetContent>
            </UI.Sheet>
          </div>
          <figcaption className="text-muted-foreground text-xs">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
