import { Button } from "@infisical/cipher/ui/button";
import { DataList } from "@infisical/cipher/ui/list";
import { RowLink } from "@infisical/cipher/ui/row-link";
import * as UI from "@infisical/cipher/ui/sheet";
import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <UI.Sheet>
        <UI.SheetTrigger asChild>
          <Button variant="outline">Inspect resource</Button>
        </UI.SheetTrigger>
        <UI.SheetContent>
          <UI.SheetHeader>
            <UI.SheetTitle>prod-postgres-primary</UI.SheetTitle>
          </UI.SheetHeader>
          <UI.SheetBody>
            <DataList
              variant="props"
              items={[
                ["Type", "PostgreSQL"],
                [
                  "Gateway",
                  <RowLink
                    key="gateway"
                    link={{ href: "/design-system/components/navigation/row-link" }}
                  >
                    us-east-gateway
                  </RowLink>
                ],
                ["Session recording", <Switch key="recording" aria-label="Session recording" />]
              ]}
            />
          </UI.SheetBody>
          <UI.SheetFooter>
            <UI.SheetClose asChild>
              <Button>Done</Button>
            </UI.SheetClose>
          </UI.SheetFooter>
        </UI.SheetContent>
      </UI.Sheet>
    </div>
  );
}
