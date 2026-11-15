import { SessionReplay } from "@infisical/cipher/ui/session-replay";

import { TerminalViewport } from "./renderers";
import { terminalLog, toTerminalEvents } from "./sample";

const events = toTerminalEvents(terminalLog);

export default function Example() {
  return (
    <SessionReplay
      aria-label="Replay of deploy on payments-prod-01"
      events={events}
      duration={144_000}
      viewport={(state) => <TerminalViewport {...state} />}
    />
  );
}
