import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { RemoteDesktop } from "@infisical/cipher/ui/remote-desktop";

import { drawFakeDesktop } from "./fake-desktop";

const host =
  "windows-server-2022-datacenter-eu-central-1-finance-reporting-primary.corp.internal.example.com";
const account =
  "svc-finance-quarterly-close-reconciliation-administrator@corp.internal.example.com";
const details = [
  { label: "Host", value: host },
  { label: "Account", value: account },
  { label: "Reason", value: "Investigating the failed quarter-end reconciliation job INC-48213" }
];
const ultrawide = { width: 3440, height: 1440 };
const noop = () => {};

export default function Example() {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(
    () => drawFakeDesktop(canvas.current, { host, pointer: { x: 2200, y: 700 } }),
    []
  );
  const actions = (
    <>
      <Badge tone="outline">Recorded</Badge>
      <Badge tone="warn">Expires in 4 min</Badge>
      <Button variant="ghost" size="sm">
        Extend session
      </Button>
    </>
  );
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] gap-x-4 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="h-[20rem] w-full min-w-0">
          <RemoteDesktop
            status="reconnecting"
            label={"Remote desktop, " + host}
            desktopSize={ultrawide}
            canvasRef={canvas}
            details={details}
            actions={actions}
            onPointer={noop}
            onKey={noop}
            onCtrlAltDel={noop}
            onClipboardSend={noop}
            onDisconnect={noop}
            onReconnect={noop}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"reconnecting over an ultrawide frame, long details, many actions"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="h-[20rem] w-full min-w-0">
          <RemoteDesktop
            status="error"
            label={"Remote desktop, " + host}
            error="The gateway could not reach windows-server-2022-datacenter-eu-central-1-finance-reporting-primary on port 3389. Check that the host is online and that the gateway can resolve its name, then reconnect."
            details={details}
            actions={actions}
            onCtrlAltDel={noop}
            onClipboardSend={noop}
            onDisconnect={noop}
            onReconnect={noop}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"error with a long reason"}
        </figcaption>
      </figure>
    </div>
  );
}
