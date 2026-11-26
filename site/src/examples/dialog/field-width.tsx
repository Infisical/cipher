import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/dialog";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";

import { OverlayStage } from "../overlay-stage";

export default function Example() {
  return (
    <OverlayStage height={340}>
      <UI.Dialog open modal={false}>
        <UI.DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
          <UI.DialogHeader>
            <UI.DialogTitle>Add a secret</UI.DialogTitle>
          </UI.DialogHeader>
          <Field label="Key">
            <Input mono defaultValue="STRIPE_WEBHOOK_SIGNING_SECRET_FOR_BILLING_RECONCILIATION" />
          </Field>
          <UI.DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button>Add secret</Button>
          </UI.DialogFooter>
        </UI.DialogContent>
      </UI.Dialog>
    </OverlayStage>
  );
}
