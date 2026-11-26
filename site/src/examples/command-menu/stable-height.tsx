import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { CommandMenu, type CommandMenuGroup } from "@infisical/cipher/ui/command-menu";

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
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Search workspace
      </Button>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        stableHeight
        hotkey={false}
        label="Search workspace"
        groups={groups}
      />
    </div>
  );
}
