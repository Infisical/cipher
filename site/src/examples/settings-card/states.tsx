import { useState } from "react";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { Field } from "@infisical/cipher/ui/field";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";
import { Input } from "@infisical/cipher/ui/input";
import { Select } from "@infisical/cipher/ui/select";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";
import { Switch } from "@infisical/cipher/ui/switch";

const Figure = ({
  caption,
  narrow,
  children
}: {
  caption: string;
  narrow?: boolean;
  children: React.ReactNode;
}) => (
  <figure className={"m-0 flex min-w-0 flex-col gap-3 " + (narrow ? "w-full max-w-88" : "w-full")}>
    <div className="flex w-full min-w-0 flex-col items-stretch">{children}</div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

const longTitle = "Machine identity token time to live and renewal limits for production";

export default function Example() {
  const [signups, setSignups] = useState(true);
  const [retention, setRetention] = useState("30");
  const [name, setName] = useState("payments-api-production");
  const [ttl, setTtl] = useState("2592000");
  const [search, setSearch] = useState("");
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-x-6 gap-y-8">
      <Figure caption="Sparse: a toggle, no footer">
        <SettingsCard
          title="Allow user signups"
          action={
            <Switch aria-label="Allow user signups" checked={signups} onChange={setSignups} />
          }
        />
      </Figure>
      <Figure caption="Sparse: a badge and a select">
        <SettingsCard
          title={
            <>
              Audit log retention{" "}
              <Badge tone="soft" size="sm">
                Enterprise
              </Badge>
            </>
          }
          action={
            <Select
              aria-label="Retention"
              value={retention}
              onChange={setRetention}
              options={[
                { value: "30", label: "30 days" },
                { value: "90", label: "90 days" }
              ]}
            />
          }
        />
      </Figure>
      <Figure caption="Typical: danger">
        <SettingsCard
          tone="danger"
          title="Secrets cache"
          description="Encrypted, temporary storage for all secrets in the system, used for frequently accessed credentials."
          actions={<Button variant="destructive">Invalidate secrets cache</Button>}
        />
      </Figure>
      <Figure caption="Typical: Save footer with a docs link and an action">
        <SettingsCard
          title={
            <>
              Project details{" "}
              <DocumentationLink href="https://infisical.com/docs" subject="Projects" />
            </>
          }
          action={<Button variant="outline">Copy project ID</Button>}
          dirty={name !== "payments-api"}
          onSave={() => undefined}
          onDiscard={() => setName("payments-api")}
        >
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
        </SettingsCard>
      </Figure>
      <Figure
        caption="Stressed: long title, badge, docs link, search and three actions, narrow"
        narrow
      >
        <SettingsCard
          title={
            <>
              {longTitle}{" "}
              <Badge tone="soft" size="sm">
                Enterprise
              </Badge>{" "}
              <DocumentationLink href="https://infisical.com/docs" subject="Token limits" />
            </>
          }
          description="Applies to every machine identity in Acme Corporation, including the ones created by Terraform, the Kubernetes operator and the CLI."
          action={
            <>
              <HeaderSearch
                label="Search rules"
                placeholder="Search rules"
                value={search}
                onValueChange={setSearch}
              />
              <Button variant="outline">Export</Button>
              <Button variant="outline">Import</Button>
              <Button icon="plus">Add rule</Button>
            </>
          }
          dirty={ttl !== "86400"}
          saveLabel="Save limits"
          actions={
            <Button variant="outline" size="sm">
              Reset to defaults
            </Button>
          }
          onSave={() => undefined}
          onDiscard={() => setTtl("86400")}
        >
          <Field label="Default time to live">
            <Input value={ttl} onChange={(event) => setTtl(event.target.value)} />
          </Field>
        </SettingsCard>
      </Figure>
    </div>
  );
}
