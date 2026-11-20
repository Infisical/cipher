import * as React from "react";

import { isDev } from "./dev";

const FrameContext = React.createContext(false);

type FrameFoot = { target: HTMLElement | null; claim: (claimed: boolean) => void };
const FrameFootContext = React.createContext<FrameFoot | null>(null);

/** Marks a subtree as inside a framed container, or, with framed false, starts a fresh surface such as an overlay. */
export function FrameScope({ framed, children }: { framed: boolean; children: React.ReactNode }) {
  return (
    <FrameContext value={framed}>
      {framed ? children : <FrameFootContext value={null}>{children}</FrameFootContext>}
    </FrameContext>
  );
}

/** Offers a frame's empty footer band to one descendant, which portals its footer into target and claims it while it has one. */
export function FrameFootSlot({
  value,
  children
}: {
  value: FrameFoot | null;
  children: React.ReactNode;
}) {
  return <FrameFootContext value={value}>{children}</FrameFootContext>;
}

export function useFrameFoot() {
  return React.useContext(FrameFootContext);
}

/**
 * Whether this primitive renders inside a framed container, where it drops its own frame so two frames never nest.
 * Pass the variant the caller asked for to warn in development when an explicit framed variant is dropped.
 */
export function useInFrame(component: string, requested?: string): boolean {
  const inFrame = React.useContext(FrameContext);
  const forced = inFrame && requested === "framed";
  React.useEffect(() => {
    if (isDev && forced)
      console.warn(
        `${component} variant="framed" renders inside another framed container, so it drops to its frameless treatment. Remove the variant, and use Inset for a block inside a frame: tinted, with no border.`
      );
  }, [component, forced]);
  return inFrame;
}
