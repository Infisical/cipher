import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Icon } from "@infisical/cipher/ui/icon";
import { PageHeader } from "@infisical/cipher/ui/page-header";
import { Sidebar } from "@infisical/cipher/ui/sidebar";
import {
  AppInset,
  AppShell,
  PageGutter,
  type ShellTheme,
  TopBar
} from "@infisical/cipher/ui/top-bar";

const organizations = [
  { value: "acme", label: "Acme Corp", group: "Current organization" },
  { value: "acme-eu", label: "acme-eu", group: "Sub-organizations" },
  { value: "globex", label: "Globex", group: "Other organizations" }
];
const projects = [
  { value: "payments", label: "payments-api" },
  { value: "platform", label: "platform-core-services-and-shared-infrastructure" },
  { value: "web", label: "web-dashboard" }
];
const environments = [
  { value: "dev", label: "Development" },
  { value: "staging", label: "Staging" },
  { value: "prod", label: "Production" }
];
const labelOf = (options: { value: string; label: string }[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const Bar = ({ defaultProject = "payments" }: { defaultProject?: string }) => {
  const [org, setOrg] = useState("acme");
  const [project, setProject] = useState(defaultProject);
  const [environment, setEnvironment] = useState("prod");
  const [theme, setTheme] = useState<ShellTheme>("system");
  return (
    <TopBar
      breadcrumb={[
        {
          label: labelOf(organizations, org),
          href: "#top-bar",
          media: <Icon name="building" />,
          switcher: {
            label: "Switch organization",
            searchable: true,
            placeholder: "Search organizations",
            options: organizations,
            value: org,
            onChange: setOrg,
            actions: [{ label: "Organization settings", icon: "settings" }]
          }
        },
        {
          label: labelOf(projects, project),
          href: "#top-bar",
          switcher: {
            label: "Switch project",
            options: projects,
            value: project,
            onChange: setProject
          }
        },
        {
          label: labelOf(environments, environment),
          switcher: {
            label: "Switch environment",
            options: environments,
            value: environment,
            onChange: setEnvironment
          }
        }
      ]}
      notifications={{ unread: 2 }}
      search={{ onClick: () => {} }}
      account={{
        name: "Sarah Lin",
        email: "sarah@acme.dev",
        items: [
          { label: "Personal settings", icon: "user" },
          { label: "Invite users", icon: "user-plus" }
        ],
        theme: { value: theme, onChange: setTheme },
        endItems: [
          { label: "Copy token", icon: "copy" },
          { type: "separator" },
          { label: "Log out" }
        ]
      }}
    />
  );
};

export default function Example() {
  const [current, setCurrent] = useState("secrets");
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <AppShell>
              <Bar />
              <Sidebar
                sections={[
                  {
                    items: [
                      { id: "home", label: "Home", icon: "home" },
                      { id: "secrets", label: "Secrets", icon: "key" },
                      { id: "approvals", label: "Approvals", icon: "inbox", count: 3 }
                    ]
                  }
                ]}
                current={current}
                onNavigate={(item) => setCurrent(item.id)}
              />
              <AppInset>
                <PageGutter>
                  <PageHeader
                    title="Secrets"
                    badges={<Badge tone="warn">Production</Badge>}
                    description="3 secrets are missing in production."
                    actions={<Button variant="accent">Add secret</Button>}
                  />
                </PageGutter>
              </AppInset>
            </AppShell>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Beside the sidebar, organization switcher over the sidebar"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-40 w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <AppShell>
              <Bar defaultProject="platform" />
              <AppInset />
            </AppShell>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Without a sidebar, long project name truncates"}
        </figcaption>
      </figure>
    </div>
  );
}
