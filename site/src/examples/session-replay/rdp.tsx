import { SessionReplay } from "@infisical/cipher/ui/session-replay";

import { RdpCanvasViewport } from "./renderers";
import { rdpLog, toRdpEvents } from "./sample";

const events = toRdpEvents(rdpLog);

export default function Example() {
  return (
    <SessionReplay
      aria-label="Replay of Administrator on win-backup-02"
      events={events}
      duration={60_000}
      viewport={(state) => <RdpCanvasViewport {...state} />}
    />
  );
}
