import * as React from "react";

import { CipherScope } from "@infisical/cipher/scope";

export const environments = [
  "Development",
  "Staging",
  "Production",
  "QA",
  "Preview",
  "Sandbox",
  "Load testing",
  "Disaster recovery",
  "EU Central",
  "US East",
  "US West",
  "Asia Pacific",
  "Canary",
  "Performance",
  "Integration",
  "Partner demo"
];

/** Holds an open overlay inside the example box, so the showcase captures it. The box is the containing block, the portal target and the collision boundary. */
export function OverlayStage({
  height = 320,
  children
}: {
  height?: number;
  children: React.ReactNode;
}) {
  const [box, setBox] = React.useState<HTMLDivElement | null>(null);
  return (
    <div ref={setBox} className="relative w-full" style={{ height, contain: "layout paint" }}>
      {box && <CipherScope portalContainer={box}>{children}</CipherScope>}
    </div>
  );
}
