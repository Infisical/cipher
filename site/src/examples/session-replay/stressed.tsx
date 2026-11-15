import { SessionReplay } from "@infisical/cipher/ui/session-replay";

import { TerminalViewport } from "./renderers";
import { stressedLog, toTerminalEvents } from "./sample";

const events = toTerminalEvents(stressedLog);

export default function Example() {
  return (
    <SessionReplay
      aria-label="Replay of contractor_readonly_reporting on payments-core-primary"
      events={events}
      defaultSpeed={4}
      viewport={(state) => <TerminalViewport {...state} />}
    />
  );
}
