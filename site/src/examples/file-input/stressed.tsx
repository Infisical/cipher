import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { FileInput } from "@infisical/cipher/ui/file-input";

const sample = (name: string, size: number) => new File([new Uint8Array(size)], name);

const names = [
  "payments-service-production-us-east-1-database-credentials-rotation-2026-11-15.p12",
  "internal-certificate-authority-intermediate-bundle-with-full-chain-and-cross-signed-roots.pfx",
  "edge-gateway.p12",
  "customer-portal-mtls-client-certificate-for-the-legacy-billing-integration-team.pfx",
  "kubernetes-ingress-wildcard.p12",
  "a-very-long-file-name-without-any-natural-break-points-for-wrapping-or-truncation-to-use.p12",
  "vpn.pfx",
  "observability-collector-otlp-exporter-client-identity-staging-eu-central-1.p12",
  "ci-runner-signing-identity.pfx",
  "partner-sftp-endpoint-certificate-renewed-after-the-november-incident-review.p12"
];

export default function Example() {
  const [files, setFiles] = useState(() =>
    names.map((name, index) => sample(name, 40_000 + index * 97_331))
  );
  return (
    <figure className="m-0 flex w-full max-w-xl min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <Field label="Certificate keystores">
          <FileInput
            multiple
            accept=".p12,.pfx"
            maxSize={1024 * 1024}
            files={files}
            error="payments-service-production-us-east-1-database-credentials-rotation-2026-11-15.p12 needs a password to open. Enter it below, or remove the file."
            onFiles={(added) => setFiles((current) => [...current, ...added])}
            onRemove={(_file, index) =>
              setFiles((current) => current.filter((_, position) => position !== index))
            }
          />
        </Field>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Stressed, long names, many files and errors"}
      </figcaption>
    </figure>
  );
}
