import { useState } from "react";

import { Field } from "@infisical/cipher/ui/field";
import { TagsInput } from "@infisical/cipher/ui/tags-input";

const urnPrefix = "urn:";

export default function Example() {
  const [contexts, setContexts] = useState([
    "urn:oasis:names:tc:SAML:2.0:ac:classes:MobileTwoFactorContract",
    "urn:infisical:mfa:totp"
  ]);
  const [refusal, setRefusal] = useState<string>();
  const [labels, setLabels] = useState<string[]>([]);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="MFA authentication contexts" error={refusal}>
            <TagsInput
              label="MFA authentication contexts"
              mono
              value={contexts}
              onChange={setContexts}
              invalid={Boolean(refusal)}
              validate={(tag) =>
                tag.startsWith(urnPrefix) ? undefined : `${tag} is not a URN. Start it with urn:`
              }
              onValidationChange={setRefusal}
              placeholder="urn:oasis:names:tc:SAML:2.0:ac:classes:..."
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Mono values with validation"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Labels" description="Press Enter or type a comma to add a label.">
            <TagsInput
              label="Labels"
              value={labels}
              onChange={setLabels}
              placeholder="payments, backend"
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Field label="Allowed domains">
            <TagsInput
              label="Allowed domains"
              defaultValue={["acme.test", "corp.acme.test"]}
              disabled
            />
          </Field>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
    </div>
  );
}
