import { Rocket } from "lucide-react";

import { Badge } from "@infisical/cipher/ui/badge";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Badge icon="infinity">No limit</Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"outline"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Badge tone="info" icon="flask">
            Trial
          </Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"info"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Badge tone="warn" icon="clock">
            Expires in 7 days
          </Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"warn"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Badge tone="bad" icon="lock" size="sm">
            Locked
          </Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"sm"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Badge tone="soft" icon={Rocket}>
            Launch
          </Badge>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Lucide component"}</figcaption>
      </figure>
    </div>
  );
}
