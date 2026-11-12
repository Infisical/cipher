import { useState } from "react";

import { Alert, Banner } from "@infisical/cipher/ui/alert";

export default function Example() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Alert title="Rotation is scheduled">The token rotates every 30 days.</Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"neutral"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Alert tone="info" title="Read access only">
            This connection can fetch secrets.{" "}
            <a href="https://infisical.com/docs">Review its scopes</a>
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"info"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Alert tone="ok" title="Connection verified">
            The provider accepted the supplied credentials.
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"ok"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Alert tone="warn" title="Token expires soon">
            Replace the token before it expires in 7 days.
          </Alert>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"warn"}</figcaption>
      </figure>
      {visible && (
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Alert tone="bad" title="Connection failed" onDismiss={() => setVisible(false)}>
              The provider rejected the token. Check its access scope and try again.
            </Alert>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"bad"}</figcaption>
        </figure>
      )}
      <Banner>Production changes require an approval.</Banner>
    </div>
  );
}
