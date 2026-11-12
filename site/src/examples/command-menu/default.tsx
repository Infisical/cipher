import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { CommandMenu } from "@infisical/cipher/ui/command-menu";

export default function Example() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [recent, setRecent] = useState(true);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Search commands
        </Button>
        <CommandMenu
          open={open}
          onOpenChange={setOpen}
          label="Search commands"
          recent={
            recent
              ? [
                  {
                    id: "recent-secret",
                    label: "stripe_api_key",
                    description: "production",
                    mono: true,
                    kind: "secret"
                  },
                  {
                    id: "recent",
                    label: "Audit logs",
                    href: "#input",
                    kind: "page",
                    icon: "history"
                  }
                ]
              : []
          }
          groups={[
            {
              label: "Go to",
              items: [
                { id: "home", label: "Home", icon: "home", shortcut: "g then h" },
                { id: "secrets", label: "Secrets", icon: "key", shortcut: "g then s" },
                { id: "certificates", label: "Certificates", icon: "cert", shortcut: "g then c" },
                { id: "access", label: "Access", icon: "user" },
                { id: "settings", label: "Project settings", kind: "setting" }
              ]
            },
            {
              label: "Commands",
              items: [
                {
                  id: "history",
                  label: "View history"
                },
                {
                  id: "pin",
                  label: pinned ? "Unpin recent commands" : "Pin recent commands",
                  keepOpen: true,
                  onSelect: () => setPinned(!pinned)
                },
                { id: "connections", label: "Connections", page: "connections" },
                {
                  id: "clear",
                  label: "Clear recent commands",
                  danger: true,
                  onSelect: () => setRecent(false)
                },
                { id: "locked", label: "Delete organization", disabled: true }
              ]
            }
          ]}
          pages={{
            connections: {
              title: "Connections",
              groups: [
                { label: "Staging", items: [{ id: "connection", label: "Inspect connection" }] }
              ]
            }
          }}
          footer={pinned ? "Recent commands pinned" : "acme-platform"}
        />
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Default"}</figcaption>
    </figure>
  );
}
