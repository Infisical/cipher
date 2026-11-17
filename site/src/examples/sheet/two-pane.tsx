import * as React from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Media } from "@infisical/cipher/ui/item";
import { Stack } from "@infisical/cipher/ui/layout";
import { DataList } from "@infisical/cipher/ui/list";
import { MiddleTruncate } from "@infisical/cipher/ui/middle-truncate";
import * as UI from "@infisical/cipher/ui/sheet";
import { Switch } from "@infisical/cipher/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@infisical/cipher/ui/tabs";
import { Textarea } from "@infisical/cipher/ui/textarea";

type Account = {
  name: string;
  folder: string;
  host: string;
  port: string;
  database: string;
  username: string;
};

const tabs = [
  { value: "permissions", label: "Permissions" },
  { value: "configuration", label: "Configuration" },
  { value: "rotation", label: "Rotation" },
  { value: "advanced", label: "Advanced" }
];

const mono = (value: string) => <span className="font-mono">{value}</span>;

const AccountSheet = ({
  label,
  account,
  tabbed = true
}: {
  label: string;
  account: Account;
  tabbed?: boolean;
}) => {
  const [tab, setTab] = React.useState("configuration");
  const [ssl, setSsl] = React.useState(true);
  const [reject, setReject] = React.useState(true);
  const id = React.useId();
  return (
    <UI.Sheet>
      <UI.SheetTrigger asChild>
        <Button variant="outline">{label}</Button>
      </UI.SheetTrigger>
      <UI.SheetContent size="xl">
        <UI.SheetAside
          mainLabel="Configuration"
          media={<Media icon="machine" />}
          title={account.name}
          description={account.folder}
          badges={<Badge tone="outline">PostgreSQL</Badge>}
        >
          <DataList
            variant="props"
            items={[
              ["Description", "Writer endpoint for the orders service"],
              [
                "Template",
                <Button key="template" variant="link" size="sm" asChild>
                  <a href="#/components/sheet">production-postgres</a>
                </Button>
              ],
              ["Host", <MiddleTruncate key="host" mono text={account.host} />],
              ["Port", mono(account.port)],
              ["Database", mono(account.database)],
              ["SSL", ssl ? "Enabled" : "Disabled"],
              ["Username", mono(account.username)],
              ["Created", "November 16th, 2026"]
            ]}
          />
        </UI.SheetAside>
        {tabbed && (
          <UI.SheetHeader
            tabs={
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList aria-label="Account sections">
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
            }
          />
        )}
        <UI.SheetBody
          {...(tabbed ? { role: "tabpanel", id: id + "panel", "aria-labelledby": id + tab } : {})}
        >
          {!tabbed || tab === "configuration" ? (
            <Stack gap={16}>
              <Field label="Name">
                <Input defaultValue={account.name} />
              </Field>
              <Field label="Description" optional>
                <Textarea defaultValue="Writer endpoint for the orders service" rows={2} />
              </Field>
              <Field label="Host">
                <Input defaultValue={account.host} />
              </Field>
              <Field label="Port">
                <Input defaultValue={account.port} />
              </Field>
              <Field label="Database">
                <Input defaultValue={account.database} />
              </Field>
              <Switch layout="row" label="SSL enabled" checked={ssl} onCheckedChange={setSsl} />
              <Switch
                layout="row"
                label="Reject unauthorized"
                description="Refuse servers whose certificate does not chain to a trusted CA."
                checked={reject}
                onCheckedChange={setReject}
              />
              <Field label="Username">
                <Input defaultValue={account.username} />
              </Field>
            </Stack>
          ) : (
            <p className="text-muted-foreground">Nothing to configure here yet.</p>
          )}
        </UI.SheetBody>
        <UI.SheetFooter>
          <UI.SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </UI.SheetClose>
          <Button>Save</Button>
        </UI.SheetFooter>
      </UI.SheetContent>
    </UI.Sheet>
  );
};

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <AccountSheet
        label="Two-pane account"
        account={{
          name: "orders-primary",
          folder: "production-databases",
          host: "orders-primary.internal.acme.dev",
          port: "5432",
          database: "orders",
          username: "svc_orders_primary"
        }}
      />
      <AccountSheet
        label="Long values"
        account={{
          name: "orders-primary-replica-us-east-1-failover-standby-02",
          folder: "production-databases / us-east-1 / payments-and-orders-cluster",
          host: "orders-primary-replica-02.us-east-1.rds.internal.payments.acme-corporation.dev",
          port: "5432",
          database: "orders_ledger_reconciliation_archive_2026",
          username: "svc_orders_primary_reconciliation_readonly_rotation_managed"
        }}
      />
      <AccountSheet
        label="Without tabs"
        tabbed={false}
        account={{
          name: "orders-primary",
          folder: "production-databases",
          host: "orders-primary.internal.acme.dev",
          port: "5432",
          database: "orders",
          username: "svc_orders_primary"
        }}
      />
    </div>
  );
}
