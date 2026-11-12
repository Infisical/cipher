import { useEffect, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { RouteProgress } from "@infisical/cipher/ui/route-progress";
import { Meta } from "@infisical/cipher/ui/text";

export default function Example() {
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!pending) return undefined;
    const timer = window.setTimeout(() => setPending(false), 2400);
    return () => window.clearTimeout(timer);
  }, [pending]);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative flex h-24 flex-col items-start justify-end gap-2 contain-layout">
            <RouteProgress pending={pending} />
            <Button variant="outline" disabled={pending} onClick={() => setPending(true)}>
              Open audit logs
            </Button>
            <Meta mono={false} role="status">
              {pending ? "Opening audit logs" : "Audit logs open"}
            </Meta>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Route progress while a navigation resolves"}
        </figcaption>
      </figure>
    </div>
  );
}
