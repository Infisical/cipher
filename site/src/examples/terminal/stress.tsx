import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Terminal, type TerminalHandle } from "@infisical/cipher/ui/terminal";

const names = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
const palette = [
  names.map((name, index) => `\x1b[${30 + index}m${name.padEnd(8)}\x1b[0m`).join(" "),
  names.map((name, index) => `\x1b[${90 + index}m${("bright " + name).padEnd(14)}\x1b[0m`).join(" ")
];
const header =
  " event_id                             | tenant_slug                                   | payload";
const rows = Array.from(
  { length: 60 },
  (_, index) =>
    ` 9f1c2e7a-${String(index).padStart(4, "0")}-4b1d-9a7e-3c55d0f1a2b8 | acme-corporation-international-holdings-eu-${index % 7} | {"type":"secret.rotated","path":"/services/payments/stripe/webhook-signing-secret","actor":"machine-identity-${index}"}`
);
const output = [
  "analytics_readonly=> \\x",
  "Expanded display is off.",
  "analytics_readonly=> select event_id, tenant_slug, payload from audit_events order by created_at desc limit 60;",
  header,
  "-".repeat(header.length + 120),
  ...rows,
  "(60 rows)",
  "",
  ...palette,
  "",
  "\x1b[31mERROR:\x1b[0m  permission denied for table billing_invoices_archive_2019_2020_partitioned_by_month",
  "analytics_readonly=> "
].join("\r\n");

function Session(props: Omit<React.ComponentProps<typeof Terminal>, "status">) {
  const terminal = React.useRef<TerminalHandle>(null);
  React.useEffect(() => terminal.current?.write(output), []);
  return <Terminal ref={terminal} status="connected" {...props} />;
}

const actions = (
  <>
    <Button variant="ghost">Copy session ID</Button>
    <Button variant="ghost">Disconnect</Button>
  </>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[minmax(0,2fr)_minmax(0,1fr)] items-start gap-x-6 gap-y-8 max-lg:grid-cols-1">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Session
          label="analytics_readonly@warehouse-replica-eu-west-1-prod-cluster-04.internal:5432/events_2026"
          icon="server"
          actions={actions}
          className="h-96"
        />
        <figcaption className="text-muted-foreground text-xs">
          {"Long label, wide rows and scrollback"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Session
          label="analytics_readonly@warehouse-replica-eu-west-1-prod-cluster-04.internal:5432/events_2026"
          icon="server"
          actions={actions}
          className="h-96"
        />
        <figcaption className="text-muted-foreground text-xs">{"Narrow"}</figcaption>
      </figure>
    </div>
  );
}
