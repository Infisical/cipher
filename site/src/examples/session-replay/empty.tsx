import { SessionReplay } from "@infisical/cipher/ui/session-replay";

import { TerminalViewport } from "./renderers";

export default function Example() {
  return (
    <SessionReplay
      aria-label="Replay of an empty session"
      events={[]}
      viewport={(state) => <TerminalViewport {...state} />}
    />
  );
}
