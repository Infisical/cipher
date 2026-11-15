import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import {
  RemoteDesktop,
  type RemoteDesktopKeyEvent,
  type RemoteDesktopStatus
} from "@infisical/cipher/ui/remote-desktop";

import { drawFakeDesktop } from "./fake-desktop";

const host = "win-prod-01.corp.example";

export default function Example() {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = React.useState<RemoteDesktopStatus>("connected");
  const scene = React.useRef({ host, typed: "", pointer: { x: 1180, y: 620 } });
  const paint = () => drawFakeDesktop(canvas.current, scene.current);
  React.useEffect(paint);

  const connect = () => {
    setStatus("connecting");
    window.setTimeout(() => setStatus("connected"), 1200);
  };
  const type = (event: RemoteDesktopKeyEvent) => {
    if (event.type !== "down" || event.ctrlKey || event.metaKey || event.altKey) return;
    const { typed } = scene.current;
    if (event.key === "Backspace") scene.current.typed = typed.slice(0, -1);
    else if (event.key === "Enter") scene.current.typed = typed + "\n";
    else if (event.key.length === 1) scene.current.typed = typed + event.key;
    paint();
  };

  return (
    <div className="h-[30rem] w-full min-w-0">
      <RemoteDesktop
        status={status}
        label={"Remote desktop, " + host}
        canvasRef={canvas}
        details={[
          { label: "Host", value: host },
          { label: "Account", value: "prod-administrator" }
        ]}
        actions={<Badge tone="outline">Recorded</Badge>}
        onPointer={(event) => {
          scene.current.pointer = { x: event.x, y: event.y };
          paint();
        }}
        onKey={type}
        onCtrlAltDel={() => {
          scene.current.typed += "\n[Ctrl+Alt+Del]";
          paint();
        }}
        onClipboardSend={(text) => {
          scene.current.typed += text;
          paint();
        }}
        onDisconnect={() => setStatus("disconnected")}
        onReconnect={connect}
      />
    </div>
  );
}
