import * as UI from "@infisical/cipher/ui/dialog";
import { Inset } from "@infisical/cipher/ui/inset";
import { Stack } from "@infisical/cipher/ui/layout";

import { OverlayStage } from "../overlay-stage";

const facts = [
  { label: "Endpoint URL", value: "https://app.example.com/scep/applications/9980af9e-45c1/pkiclient.exe" },
  { label: "Challenge endpoint URL", value: "https://app.example.com/scep/applications/9980af9e-45c1/challenge" }
];

export default function Example() {
  return (
    <OverlayStage height={440}>
      <UI.Dialog open modal={false}>
        <UI.DialogContent onOpenAutoFocus={(event) => event.preventDefault()}>
          <UI.DialogHeader>
            <UI.DialogTitle>SCEP enrollment</UI.DialogTitle>
          </UI.DialogHeader>
          <UI.DialogBody>
            <section className="flex flex-col gap-4 py-[var(--cipher-space-overlay-section)]">
              <h3 className="m-0 text-base font-semibold">Endpoint</h3>
              <Inset hang>
                <Stack gap={12}>
                  {facts.map((fact) => (
                    <div key={fact.label} className="flex min-w-0 flex-col gap-1">
                      <span className="text-xs font-medium text-[color:var(--cipher-muted)]">
                        {fact.label}
                      </span>
                      <span className="truncate font-mono text-sm">{fact.value}</span>
                    </div>
                  ))}
                </Stack>
              </Inset>
            </section>
          </UI.DialogBody>
        </UI.DialogContent>
      </UI.Dialog>
    </OverlayStage>
  );
}
