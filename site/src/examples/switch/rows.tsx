import { useState } from "react";

import { Card } from "@infisical/cipher/ui/card";
import { Code } from "@infisical/cipher/ui/code";
import { Switch } from "@infisical/cipher/ui/switch";

export default function Example() {
  const [audit, setAudit] = useState(true);
  const [rotation, setRotation] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" title="SCIM provisioning">
            <Switch
              layout="row"
              label="Enable SCIM"
              description="Provision and deprovision members from your identity provider."
              disabledReason="You need permission to edit SCIM."
            />
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"One row"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" title="Security">
            <Switch
              layout="row"
              label="Audit events"
              description="Stream every read and write to the audit log."
              checked={audit}
              onChange={setAudit}
            />
            <Switch
              layout="row"
              label="Automatic rotation"
              description={
                <>
                  Rotate <Code>DB_PASSWORD</Code> every 30 days.
                </>
              }
              checked={rotation}
              onChange={setRotation}
            />
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Stacked rows"}</figcaption>
      </figure>
    </div>
  );
}
