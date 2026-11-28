import { Inset } from "@infisical/cipher/ui/inset";
import { Stack } from "@infisical/cipher/ui/layout";

const facts = [
  { label: "Endpoint URL", value: "https://app.example.com/scep/applications/9980af9e-45c1/pkiclient.exe" },
  { label: "Challenge endpoint URL", value: "https://app.example.com/scep/applications/9980af9e-45c1/challenge" }
];

export default function Example() {
  return (
    <div className="w-full min-w-0 border border-[var(--cipher-line-soft)] bg-[var(--cipher-surface)]">
      <section className="flex flex-col gap-4 px-[var(--cipher-space-overlay-inset)] py-[var(--cipher-space-overlay-section)]">
        <h3 className="m-0 text-base font-semibold">Endpoint</h3>
        <Inset hang>
          <Stack gap={12}>
            {facts.map((fact) => (
              <div key={fact.label} className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-medium text-[color:var(--cipher-muted)]">{fact.label}</span>
                <span className="truncate font-mono text-sm">{fact.value}</span>
              </div>
            ))}
          </Stack>
        </Inset>
      </section>
      <section className="flex flex-col gap-4 border-t border-[var(--cipher-line-soft)] px-[var(--cipher-space-overlay-inset)] py-[var(--cipher-space-overlay-section)]">
        <h3 className="m-0 text-base font-semibold">Challenge</h3>
        <p className="m-0 text-sm text-[color:var(--cipher-muted)]">
          The title, the inset content and this text share one content edge.
        </p>
      </section>
    </div>
  );
}
