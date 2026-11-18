import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/popover";

import { environments, OverlayStage } from "../overlay-stage";

export default function Example() {
  return (
    <OverlayStage>
      <UI.Popover open>
        <UI.PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            Environments
          </Button>
        </UI.PopoverTrigger>
        <UI.PopoverContent>
          {environments.map((name) => (
            <p key={name} className="m-0">
              {name} reads from the shared folder and syncs every 15 minutes.
            </p>
          ))}
        </UI.PopoverContent>
      </UI.Popover>
    </OverlayStage>
  );
}
