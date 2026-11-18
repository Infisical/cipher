import * as UI from "@infisical/cipher/ui/dialog";

import { environments, OverlayStage } from "../overlay-stage";

export default function Example() {
  return (
    <OverlayStage height={360}>
      <UI.Dialog open modal={false}>
        <UI.DialogContent
          style={{ maxHeight: 280 }}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <UI.DialogTitle>Environments</UI.DialogTitle>
          {environments.map((name) => (
            <p key={name} className="m-0">
              {name} reads from the shared folder and syncs every 15 minutes.
            </p>
          ))}
        </UI.DialogContent>
      </UI.Dialog>
    </OverlayStage>
  );
}
