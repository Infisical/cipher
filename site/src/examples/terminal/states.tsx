import * as React from "react";

import { Terminal, type TerminalHandle } from "@infisical/cipher/ui/terminal";

const output = [
  "psql (16.4)",
  'Type "help" for help.',
  "",
  "orders=> select count(*) from orders where created_at > now() - interval '1 day';",
  " count ",
  "-------",
  "  1284",
  "(1 row)",
  "",
  "orders=> "
].join("\r\n");

function EndedSession(props: React.ComponentProps<typeof Terminal>) {
  const terminal = React.useRef<TerminalHandle>(null);
  React.useEffect(() => terminal.current?.write(output), []);
  return <Terminal ref={terminal} onRetry={() => {}} className="h-72" {...props} />;
}

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Terminal label="postgres@orders-db" status="connecting" className="h-72" />
        <figcaption className="text-muted-foreground text-xs">{"Connecting"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <EndedSession
          label="postgres@orders-db"
          status="disconnected"
          message="Session expired after 15 minutes of inactivity."
        />
        <figcaption className="text-muted-foreground text-xs">{"Disconnected"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <EndedSession
          label="postgres@orders-db"
          status="error"
          message="The gateway did not respond. Check that it is online."
        />
        <figcaption className="text-muted-foreground text-xs">{"Error"}</figcaption>
      </figure>
    </div>
  );
}
