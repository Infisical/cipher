import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";
import { Icon } from "@infisical/cipher/ui/icon";

import { OverlayStage } from "../overlay-stage";

const folders = [
  { name: "api", count: 12 },
  { name: "billing", count: 0 },
  { name: "payments-reconciliation-service-production-eu-west-1", count: 1284 }
];

export default function Example() {
  return (
    <OverlayStage height={260}>
      <UI.DropdownMenu open modal={false}>
        <UI.DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Import
          </Button>
        </UI.DropdownMenuTrigger>
        <UI.DropdownMenuContent onCloseAutoFocus={(event) => event.preventDefault()}>
          {folders.map(({ name, count }) => (
            <UI.DropdownMenuItem key={name} disabled={count === 0}>
              <Icon name="plus" />
              Add all {count.toLocaleString("en-US")} {count === 1 ? "secret" : "secrets"} from{" "}
              {name}
            </UI.DropdownMenuItem>
          ))}
          <UI.DropdownMenuSeparator />
          <UI.DropdownMenuItem description={`${folders.length} folders selected`}>
            Add {folders.length} folders
          </UI.DropdownMenuItem>
        </UI.DropdownMenuContent>
      </UI.DropdownMenu>
    </OverlayStage>
  );
}
