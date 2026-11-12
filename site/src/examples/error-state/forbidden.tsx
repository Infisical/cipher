import { useState } from "react";

import { ErrorState } from "@infisical/cipher/patterns/error-state";
import { Button } from "@infisical/cipher/ui/button";
import { Sidebar } from "@infisical/cipher/ui/sidebar";
import { AppInset, AppShell, PageGutter, TopBar } from "@infisical/cipher/ui/top-bar";

export default function Example() {
  const [current, setCurrent] = useState("projects");
  const [requested, setRequested] = useState(false);
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
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
                    preset="forbidden"
                    homeHref="#error-state"
                    onBack={() => {}}
                    actions={
                      <Button
                        variant="outline"
                        disabledReason={
                          requested ? "Access requested. An admin will review it." : undefined
                        }
                        onClick={() => setRequested(true)}
                      >
                        {requested ? "Access requested" : "Request access"}
                      </Button>
                    }
                  />
                </PageGutter>
              </AppInset>
            </AppShell>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"forbidden, in the shell, with Request access"}
        </figcaption>
      </figure>
    </div>
  );
}
