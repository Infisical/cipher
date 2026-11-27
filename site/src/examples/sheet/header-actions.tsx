import * as React from "react";

import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@infisical/cipher/ui/tabs";

const methods = ["Universal Auth", "Kubernetes Auth", "OIDC Auth"];

const ActionSheet = ({
  label,
  title,
  tabs,
  actions
}: {
  label: string;
  title: string;
  tabs?: { value: string; label: string }[];
  actions: React.ReactNode;
}) => {
  const [tab, setTab] = React.useState(tabs?.[0].value ?? "");
  const id = React.useId();
  return (
    <UI.Sheet>
      <UI.SheetTrigger asChild>
        <Button variant="outline">{label}</Button>
      </UI.SheetTrigger>
      <UI.SheetContent size="md">
        <UI.SheetHeader
          actions={actions}
          tabs={
            tabs && (
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList aria-label={title}>
                  {tabs.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      id={id + item.value}
                      aria-controls={id + "panel"}
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )
          }
        >
          <UI.SheetTitle>{title}</UI.SheetTitle>
        </UI.SheetHeader>
        <UI.SheetBody
          {...(tabs ? { role: "tabpanel", id: id + "panel", "aria-labelledby": id + tab } : {})}
        >
          <ul className="flex flex-col gap-2">
            {methods.map((method) => (
              <li key={method}>{method}</li>
            ))}
          </ul>
        </UI.SheetBody>
      </UI.SheetContent>
    </UI.Sheet>
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <ActionSheet
        label="Tabs and an action"
        title="machine-identity-prod"
        tabs={[
          { value: "auth", label: "Authentication" },
          { value: "projects", label: "Projects" },
          { value: "metadata", label: "Metadata" }
        ]}
        actions={
          <Button variant="outline" size="sm" icon="plus">
            Add method
          </Button>
        }
      />
      <ActionSheet
        label="Title and an action"
        title="Authentication methods"
        actions={
          <Button variant="outline" size="sm" icon="plus">
            Add method
          </Button>
        }
      />
      <ActionSheet
        label="Many tabs and long labels"
        title="payments-ledger-replication-readwrite-us-east-1"
        tabs={[
          { value: "auth", label: "Authentication methods" },
          { value: "projects", label: "Project memberships" },
          { value: "groups", label: "Groups" },
          { value: "metadata", label: "Metadata and tags" },
          { value: "activity", label: "Activity" }
        ]}
        actions={
          <Button variant="outline" size="sm" icon="plus">
            Add authentication method
          </Button>
        }
      />
    </div>
  );
}
