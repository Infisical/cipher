import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dropdown-menu";

import { environments, OverlayStage } from "../overlay-stage";

export default function Example() {
  return (
    <OverlayStage>
      <UI.DropdownMenu open modal={false}>
        <UI.DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Environment
          </Button>
        </UI.DropdownMenuTrigger>
        <UI.DropdownMenuContent onCloseAutoFocus={(event) => event.preventDefault()}>
          <UI.DropdownMenuLabel>Move to</UI.DropdownMenuLabel>
          {environments.map((name) => (
            <UI.DropdownMenuItem key={name}>{name}</UI.DropdownMenuItem>
          ))}
        </UI.DropdownMenuContent>
      </UI.DropdownMenu>
    </OverlayStage>
  );
}
