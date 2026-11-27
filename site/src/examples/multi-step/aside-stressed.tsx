import * as React from "react";
import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { Textarea } from "@infisical/cipher/ui/textarea";
import { toast } from "@infisical/cipher/ui/sonner";

const docs = "https://infisical.com/docs/documentation/platform/pki/certificates";

const Flow = ({
  variant,
  trigger
}: {
  variant: "dialog" | "sheet";
  trigger: React.ReactElement;
}) => {
  const [authority, setAuthority] = useState(
    "Production internal intermediate certificate authority (2026 rotation)"
  );
  const [names, setNames] = useState("payments-gateway.internal.eu-west-1.prod.example.com");
  return (
    <MultiStep
      variant={variant}
      layout="aside"
      title="Issue a certificate from an internal certificate authority"
      trigger={trigger}
      completeLabel="Issue certificate"
      onComplete={() => {
        toast("Certificate issued.");
      }}
      steps={[
        {
          title: "Certificate authority and issuing template",
          summary: authority,
          aside: {
            title: "Certificate authority and issuing template",
            description:
              "The authority signs the certificate and the template caps what it may contain: key algorithms, the longest validity, allowed name patterns and extended key usages. A request outside the template is refused before it reaches the authority, so choose the template that matches the workload rather than the most permissive one.",
            docsHref: `${docs}#certificate-templates`,
            docsLabel: "Certificate templates and the limits they enforce"
          },
          content: (
            <Field label="Certificate authority">
              <Input value={authority} onChange={(event) => setAuthority(event.target.value)} />
            </Field>
          )
        },
        {
          title: "Subject and subject alternative names",
          summary: names,
          aside: {
            description:
              "Clients check the alternative names, not the common name, so list every hostname and address the service answers on. Wildcards cover one label only: *.prod.example.com does not cover api.eu.prod.example.com.",
            docsHref: `${docs}#subject-alternative-names`
          },
          content: (
            <Field label="Alternative names" description="One per line.">
              <Textarea value={names} onChange={(event) => setNames(event.target.value)} rows={3} />
            </Field>
          )
        },
        {
          title: "Key algorithm, key size and signature",
          aside: {
            description:
              "ECDSA P-256 keys are smaller and faster than RSA 2048 at a comparable strength. Pick RSA only when an older client cannot negotiate ECDSA.",
            docsHref: `${docs}#key-algorithms`
          },
          content: (
            <Field label="Key algorithm">
              <Input defaultValue="ECDSA P-256" />
            </Field>
          )
        },
        {
          title: "Validity period and automatic renewal window",
          aside: {
            description:
              "Short lifetimes limit the damage of a leaked key. With automatic renewal, Infisical issues the replacement before the renewal window closes and the old certificate stays valid until it expires, so deployments that reload on change never serve an expired certificate.",
            docsHref: `${docs}#renewal`
          },
          content: (
            <Field label="Validity in days">
              <Input defaultValue="90" inputMode="numeric" />
            </Field>
          )
        },
        {
          title: "Key usages and extended key usages",
          aside: {
            description:
              "Server authentication for TLS listeners, client authentication for mutual TLS. Leave the rest off unless a client requires them."
          },
          content: (
            <Field label="Extended key usages">
              <Input defaultValue="Server authentication, Client authentication" />
            </Field>
          )
        },
        {
          title: "Review and issue the certificate",
          aside: {
            description:
              "Issuing is final: a certificate cannot be edited after it is signed, only revoked and replaced. The private key is shown once on the next screen, so have somewhere to store it.",
            docsHref: `${docs}#revocation`,
            docsLabel: "Revoking and replacing an issued certificate"
          },
          content: (
            <p className="m-0 text-sm [overflow-wrap:anywhere]">
              Issues a certificate for {names} from {authority}.
            </p>
          )
        }
      ]}
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <Flow
        variant="sheet"
        trigger={<Button variant="outline">Issue a certificate in a sheet</Button>}
      />
      <Flow
        variant="dialog"
        trigger={<Button variant="outline">Issue a certificate in a dialog</Button>}
      />
    </div>
  );
}
