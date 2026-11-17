import * as React from "react";

import { Field } from "@infisical/cipher/ui/field";
import { Textarea } from "@infisical/cipher/ui/textarea";

const BODY =
  "MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAwTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2VhcmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDE";

const certificate = (lines: number, offset: number) =>
  [
    "-----BEGIN CERTIFICATE-----",
    ...Array.from({ length: lines }, (_, line) => {
      const start = (offset + line * 7) % BODY.length;
      return (BODY + BODY).slice(start, start + 64);
    }),
    "-----END CERTIFICATE-----"
  ].join("\n");

const SHORT = certificate(3, 0);
const CHAIN = [certificate(12, 0), certificate(12, 11), certificate(9, 23)].join("\n");

function CertificateField({ label, initial }: { label: string; initial: string }) {
  const [value, setValue] = React.useState(initial);
  return (
    <Field label={label}>
      <Textarea
        mono
        maxRows={10}
        placeholder="Paste a PEM certificate chain"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Field>
  );
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <CertificateField label="Empty" initial="" />
      <CertificateField label="One certificate" initial={SHORT} />
      <CertificateField label="Full CA chain, scrolls after 10 lines" initial={CHAIN} />
    </div>
  );
}
