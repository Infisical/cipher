import { type ReactNode, useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { Progress } from "@infisical/cipher/ui/progress";
import { Sidebar, type SidebarProps } from "@infisical/cipher/ui/sidebar";
import { AppInset, AppShell, TopBar } from "@infisical/cipher/ui/top-bar";

type Step = { label: string; done?: boolean };

const sections: SidebarProps["sections"] = [
  {
    items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "vaults", label: "Vaults", icon: "vault" },
      { id: "agents", label: "Agents", icon: "agent" },
      { id: "credentials", label: "Credentials", icon: "file-key" }
    ]
  },
  {
    label: "Administration",
    items: [
      { id: "access", label: "Access control", icon: "user" },
      { id: "audit", label: "Audit logs", icon: "history" },
      { id: "settings", label: "Settings", icon: "settings" }
    ]
  }
];

const steps = (done: number): Step[] =>
  ["Create a vault", "Add a credential", "Connect an agent", "Invite your team"].map(
    (label, index) => ({ label, done: index < done })
  );

const stressed: Step[] = [
  { label: "Create a vault for the production-eu-west-1 platform services", done: true },
  { label: "Add a credential", done: true },
  { label: "Connect the deployment-orchestrator-agent-with-a-very-long-identifier", done: true },
  { label: "Invite your team" },
  { label: "Require approval before an agent reads a production credential" },
  { label: "Rotate credentials every 30 days" },
  { label: "Send audit logs to your SIEM" },
  { label: "Set up a break-glass policy" },
  { label: "Review agent access" }
];

const Checklist = ({ title, items }: { title: string; items: Step[] }) => {
  const done = items.filter((item) => item.done).length;
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-3 border border-[color:var(--cipher-line-soft)] bg-[color:var(--cipher-surface)] p-3"
    >
      <Progress
        value={done}
        max={items.length}
        label={title}
        valueLabel={`${done} of ${items.length}`}
      />
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-xs">
        {items.map((item) => (
          <li
            key={item.label}
            className={`flex min-w-0 items-start gap-2 ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}
          >
            <span
              aria-hidden="true"
              className={`mt-0.5 inline-flex size-3 flex-none items-center justify-center border ${item.done ? "border-[color:var(--cipher-ink)] bg-[color:var(--cipher-ink)] text-[color:var(--cipher-surface)]" : "border-[color:var(--cipher-line)]"}`}
            >
              {item.done && <Icon name="check" size={10} />}
            </span>
            <span className="min-w-0 [overflow-wrap:anywhere]">
              {item.label}
              {item.done && <span className="sr-only">, done</span>}
            </span>
          </li>
        ))}
      </ul>
      <Button variant="link" size="xs" asChild className="self-start">
        <a href="#sidebar">Continue setup</a>
      </Button>
    </section>
  );
};

const Shell = ({
  title = "Set up Agent Vault",
  items,
  defaultCollapsed
}: {
  title?: string;
  items: Step[];
  defaultCollapsed?: boolean;
}) => {
  const [current, setCurrent] = useState("home");
  const done = items.filter((item) => item.done).length;
  return (
    <Sidebar
      sections={sections}
      current={current}
      onNavigate={(item) => setCurrent(item.id)}
      defaultCollapsed={defaultCollapsed}
      help={{ items: [{ label: "Read Docs", href: "#sidebar", external: true }] }}
      footer={<Checklist title={title} items={items} />}
      footerLabel={`${title}, ${done} of ${items.length} done`}
    />
  );
};

const Frame = ({ caption, children }: { caption: string; children: ReactNode }) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
      {children}
    </div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
        <Frame caption="Just started">
          <Shell items={steps(0)} />
        </Frame>
        <Frame caption="Halfway">
          <Shell items={steps(2)} />
        </Frame>
        <Frame caption="Long title, many steps">
          <Shell
            title="Set up Agent Vault for the platform engineering organization"
            items={stressed}
          />
        </Frame>
        <Frame caption="Rail, footer in a popover">
          <Shell items={steps(2)} defaultCollapsed />
        </Frame>
      </div>
      <div className="w-full max-w-[600px]">
        <Frame caption="Narrow, footer inline in the navigation sheet">
          <AppShell>
            <TopBar breadcrumb={[{ label: "Agent Vault", href: "#sidebar" }]} />
            <Shell items={steps(2)} />
            <AppInset />
          </AppShell>
        </Frame>
      </div>
    </div>
  );
}
