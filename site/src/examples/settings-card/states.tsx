import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { DocumentationLink } from "@infisical/cipher/ui/documentation-link";
import { Field } from "@infisical/cipher/ui/field";
import { HeaderSearch } from "@infisical/cipher/ui/header-search";
import { Input } from "@infisical/cipher/ui/input";
import { SettingsCard } from "@infisical/cipher/ui/settings-card";
import { Switch } from "@infisical/cipher/ui/switch";

const Figure = ({ caption, children }: { caption: string; children: React.ReactNode }) => (
  <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
    <div className="flex w-full min-w-0 flex-col items-stretch">{children}</div>
    <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
  </figure>
);

const environments = ["Development", "Staging", "Production", "Preview"];

function SearchCard() {
  const [search, setSearch] = useState("");
  const shown = environments.filter((name) => name.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <SettingsCard
      title="Environments"
      badges={<DocumentationLink href="https://infisical.com/docs" subject="Environments" />}
      action={
        <HeaderSearch
          label="Search environments"
          placeholder="Search environments"
          value={search}
          onValueChange={setSearch}
        />
      }
      flush
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {shown.map((name) => (
          <li key={name} className="border-b border-(--cipher-line-soft) px-4 py-3 text-sm last:border-b-0">
            {name}
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}

export default function Example() {
  const [name, setName] = useState("payments-api-production");
  const [sharing, setSharing] = useState(true);
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-x-6 gap-y-8">
      <Figure caption="Title only">
        <SettingsCard title="Secret sharing">
          <Switch label="Allow members to share secrets" checked={sharing} onChange={setSharing} />
        </SettingsCard>
      </Figure>
      <Figure caption="With a description">
        <SettingsCard
          title="Default role"
          description="The role new members get when they join."
          dirty
          onDiscard={() => undefined}
          onSave={() => undefined}
        >
          <Field label="Role">
            <Input defaultValue="Developer" />
          </Field>
        </SettingsCard>
      </Figure>
      <Figure caption="Body and save footer, unsaved">
        <SettingsCard
          title="Project name"
          dirty={name !== "payments-api"}
          hint="Names can use up to 64 characters."
          onDiscard={() => setName("payments-api")}
          onSave={() => undefined}
        >
          <Field label="Name">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
        </SettingsCard>
      </Figure>
      <Figure caption="Danger">
        <SettingsCard
          tone="danger"
          title="Secrets cache"
          description="Encrypted, temporary storage for all secrets in the system, used for frequently accessed credentials."
          actions={<Button variant="destructive">Invalidate secrets cache</Button>}
        />
      </Figure>
      <Figure caption="HeaderSearch and a docs link">
        <SearchCard />
      </Figure>
      <Figure caption="Stressed: long title, many actions, narrow">
        <div className="w-80 max-w-full">
          <SettingsCard
            title="Machine identity token time to live and renewal limits for production"
            description="Applies to every identity in Acme Corporation, including the ones created by Terraform and the Kubernetes operator."
            action={
              <>
                <Button variant="outline">Export</Button>
                <Button variant="outline">Import</Button>
                <Button icon="plus">Add rule</Button>
              </>
            }
            dirty
            hint="3 identities override these limits and keep their own values."
            saveLabel="Save limits"
            onDiscard={() => undefined}
            onSave={() => undefined}
          >
            <Field label="Default time to live">
              <Input defaultValue="2592000" />
            </Field>
          </SettingsCard>
        </div>
      </Figure>
    </div>
  );
}
