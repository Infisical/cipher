import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { SecretInput } from "@infisical/cipher/ui/secret-input";

export default function Example() {
  const [token, setToken] = useState("fabricated-example-token-7f3a");
  const [certificate, setCertificate] = useState(
    "-----BEGIN EXAMPLE-----\nnot-a-real-certificate\n-----END EXAMPLE-----"
  );
  const [pasted, setPasted] = useState('API_URL=\u00a0"https://example.com"\u200b');
  const [empty, setEmpty] = useState("");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Access token">
            <SecretInput value={token} onChange={setToken} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Masked until focused"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Webhook secret">
            <SecretInput value={empty} onChange={setEmpty} placeholder="Paste a value" />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Empty, with placeholder"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Certificate">
            <SecretInput multiline value={certificate} onChange={setCertificate} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Multiline"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Pasted value">
            <SecretInput value={pasted} onChange={setPasted} />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Invisible characters warning"}
        </figcaption>
      </figure>
    </div>
  );
}
