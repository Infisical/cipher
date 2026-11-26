import { CommandMenu, type CommandMenuGroup } from "@infisical/cipher/ui/command-menu";

import { OverlayStage } from "../overlay-stage";

const groups: CommandMenuGroup[] = [
  {
    label: "Projects",
    items: [
      { id: "payments", label: "payments-api", kind: "project", description: "12 environments" },
      { id: "orders", label: "orders-service", kind: "project", description: "4 environments" },
      { id: "edge", label: "edge-gateway", kind: "project", description: "3 environments" }
    ]
  },
  {
    label: "Secrets",
    items: [
      { id: "stripe", label: "stripe_api_key", kind: "secret", mono: true, meta: "production" },
      { id: "db", label: "database_url", kind: "secret", mono: true, meta: "staging" }
    ]
  },
  {
    label: "Settings",
    items: [{ id: "audit", label: "Audit logs", kind: "setting", icon: "history" }]
  }
];

export default function Example() {
  return (
    <OverlayStage height={520}>
      <CommandMenu
        defaultOpen
        stableHeight
        hotkey={false}
        label="Search workspace"
        groups={groups}
      />
    </OverlayStage>
  );
}
