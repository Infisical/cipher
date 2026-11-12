import { useState } from "react";

import { Sidebar, type SidebarProps } from "@infisical/cipher/ui/sidebar";

const spaces: SidebarProps["spaces"] = [
  {
    id: "home",
    label: "Home",
    icon: "apps",
    sections: [
      {
        items: [
          { id: "home", label: "Home", icon: "home" },
          { id: "inbox", label: "Needs you", icon: "inbox", count: 4 }
        ]
      },
      {
        label: "Products",
        items: [
          {
            id: "secrets",
            label: "Secrets",
            icon: "key",
            children: [
              { id: "secrets-overview", label: "Overview" },
              { id: "secrets-integrations", label: "Integrations" },
              { id: "secrets-rotation", label: "Rotation" },
              { id: "secrets-approvals", label: "Approvals", count: 2 },
              { id: "secrets-scanning", label: "Secret scanning", count: 1 }
            ]
          },
          { id: "certificates", label: "Certificates", icon: "cert" },
          { id: "pam", label: "PAM", icon: "terminal" },
          { id: "kms", label: "KMS", icon: "lock" }
        ]
      }
    ]
  },
  {
    id: "org",
    label: "Organization",
    icon: "building",
    sections: [
      {
        items: [
          { id: "integrations", label: "Integrations", icon: "link" },
          {
            id: "access",
            label: "Access",
            icon: "user",
            children: [
              { id: "access-members", label: "Members" },
              { id: "access-identities", label: "Machine identities" },
              { id: "access-roles", label: "Roles" }
            ]
          },
          { id: "audit", label: "Audit logs", icon: "history" },
          { id: "billing", label: "Billing", icon: "file" },
          { id: "settings", label: "Settings", icon: "settings" }
        ]
      }
    ]
  }
];

const Shell = ({ start, defaultCollapsed }: { start: string; defaultCollapsed?: boolean }) => {
  const [current, setCurrent] = useState(start);
  const [unseen, setUnseen] = useState(2);
  return (
    <Sidebar
      spaces={spaces}
      current={current}
      onNavigate={(item) => setCurrent(item.id)}
      defaultCollapsed={defaultCollapsed}
      announcements={{ unread: unseen, onClick: () => setUnseen(0) }}
      help={{
        status: { label: "All systems operational", href: "#sidebar" },
        whatsNew: { unread: unseen, latest: "Oct 30", onSelect: () => setUnseen(0) },
        items: [
          { label: "Read Docs", href: "#sidebar", external: true },
          { label: "Email Support", href: "mailto:support@infisical.com" }
        ],
        version: "56a8340"
      }}
    />
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Shell start="secrets-overview" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Expanded, a child page current"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Shell start="secrets-approvals" defaultCollapsed />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Rail, counts as dots"}</figcaption>
      </figure>
    </div>
  );
}
