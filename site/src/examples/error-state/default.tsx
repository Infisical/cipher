import { useState } from "react";

import { ErrorState, type ErrorStatePreset } from "@infisical/cipher/patterns/error-state";
import { Sidebar } from "@infisical/cipher/ui/sidebar";
import { AppInset, AppShell, PageGutter, TopBar } from "@infisical/cipher/ui/top-bar";

const sampleError = Object.assign(
  new TypeError("Cannot read properties of undefined (reading 'environments')"),
  {
    stack:
      "TypeError: Cannot read properties of undefined (reading 'environments')\n    at OverviewPage (OverviewPage.tsx:212:31)\n    at renderWithHooks (react-dom.development.js:15486:18)"
  }
);

const details = [
  { label: "request", value: "req-5f3a9c2e81b4" },
  { label: "route", value: "/organizations/acme/projects/secret-management/payments-api/overview" },
  { label: "time", value: "2026-11-07 14:32:08 UTC" }
];

const Shell = ({ preset }: { preset: ErrorStatePreset }) => {
  const [current, setCurrent] = useState("projects");
  return (
    <AppShell>
      <TopBar breadcrumb={[{ label: "Acme Corp", href: "#error-state" }]} />
      <Sidebar
        sections={[
          {
            items: [
              { id: "home", label: "Home", icon: "home" },
              { id: "projects", label: "Projects", icon: "folder" },
              { id: "settings", label: "Settings", icon: "settings" }
            ]
          }
        ]}
        current={current}
        onNavigate={(item) => setCurrent(item.id)}
      />
      <AppInset>
        <PageGutter>
          <ErrorState
            preset={preset}
            homeHref="#error-state"
            error={preset === "crash" ? sampleError : undefined}
            details={preset === "crash" ? details : undefined}
            showStack
            onReload={() => {}}
            onBack={() => {}}
          />
        </PageGutter>
      </AppInset>
    </AppShell>
  );
};

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Shell preset="not-found" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"not-found, in the shell"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <Shell preset="crash" />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"crash, in the shell"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <ErrorState
              preset="not-found"
              layout="full-page"
              homeHref="#error-state"
              onBack={() => {}}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"not-found, full-page"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
            <ErrorState
              preset="crash"
              layout="full-page"
              homeHref="#error-state"
              error={sampleError}
              details={details}
              showStack
              onReload={() => {}}
            />
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"crash, full-page"}</figcaption>
      </figure>
    </div>
  );
}
