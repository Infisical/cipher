import { useState } from "react";

import { Icon } from "@infisical/cipher/ui/icon";
import { RadioGroup, RadioGroupCard } from "@infisical/cipher/ui/radio-group";

export default function Example() {
  const [protocol, setProtocol] = useState("saml");
  const [expiry, setExpiry] = useState<string>();
  const [direction, setDirection] = useState("push");
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <RadioGroup
            aria-label="Single sign-on protocol"
            value={protocol}
            onValueChange={setProtocol}
            className="grid-cols-1 sm:grid-cols-3"
          >
            <RadioGroupCard
              value="saml"
              title="SAML"
              description="Okta, Microsoft Entra ID, JumpCloud and other SAML 2.0 identity providers."
              media={<Icon name="building" />}
            />
            <RadioGroupCard
              value="oidc"
              title="OIDC"
              description="Any OpenID Connect provider with a discovery URL."
              media={<Icon name="globe" />}
            />
            <RadioGroupCard
              value="ldap"
              title="LDAP"
              description="Available on the Enterprise plan."
              media={<Icon name="user" />}
              disabled
            />
          </RadioGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Media and description, one disabled"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <RadioGroup
            aria-label="Sync direction"
            value={direction}
            onValueChange={setDirection}
            className="grid-cols-3"
          >
            <RadioGroupCard value="push" title="Push" media={<Icon name="upload" />} />
            <RadioGroupCard value="pull" title="Pull" media={<Icon name="download" />} />
            <RadioGroupCard value="both" title="Both ways" media={<Icon name="sync" />} />
          </RadioGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Media only"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <RadioGroup
            aria-label="Token expiry"
            value={expiry}
            onValueChange={setExpiry}
            className="grid-cols-3"
          >
            <RadioGroupCard value="7d" title="7 days" />
            <RadioGroupCard value="30d" title="30 days" />
            <RadioGroupCard value="never" title="Never" />
          </RadioGroup>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Title only, nothing chosen yet"}
        </figcaption>
      </figure>
    </div>
  );
}
