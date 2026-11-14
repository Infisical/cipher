import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListRow, ListSection } from "@infisical/cipher/ui/list";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const apps = [
  "AWS",
  "GitHub",
  "Vercel",
  "GCP",
  "1Password",
  "Anthropic",
  "Auth0",
  "Azure App Configuration",
  "Azure Client Secrets",
  "Azure DevOps",
  "Azure Key Vault",
  "Bitbucket",
  "Cloudflare",
  "Databricks",
  "Datadog",
  "GitLab",
  "HashiCorp Vault",
  "Heroku",
  "Netlify",
  "Okta"
];
const popular = apps.slice(0, 4);

export default function Example() {
  const [app, setApp] = useState<string>();
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [roleArn, setRoleArn] = useState("");
  const matches = apps.filter((entry) => entry.toLowerCase().includes(query.trim().toLowerCase()));
  const reset = () => {
    setApp(undefined);
    setQuery("");
    setName("");
    setRoleArn("");
  };
  return (
    <MultiStep
      variant="sheet"
      size="lg"
      title="New connection"
      trigger={<Button variant="outline">New connection</Button>}
      completeLabel={app ? `Connect ${app}` : "Connect"}
      onCancel={reset}
      onComplete={async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (name === "prod-aws") throw new Error("A connection named prod-aws already exists.");
        toast.success(`${app} connected.`);
        reset();
      }}
      steps={[
        {
          title: "App",
          heading: "Pick an app",
          summary: app,
          validate: () => (app ? true : { message: "Pick an app to continue." }),
          render: ({ next }) => {
            const row = (entry: string) => (
              <ListRow
                key={entry}
                value={entry}
                label={entry}
                title={entry}
                media={<Media size="sm">{entry.slice(0, 1)}</Media>}
                current={app === entry}
                onClick={() => {
                  setApp(entry);
                  if (!name) setName(`${entry.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-connection`);
                  next();
                }}
              />
            );
            return (
              <>
                <Input
                  icon="search"
                  aria-label="Search apps"
                  placeholder="Search apps, such as AWS or Vault"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <List label="Apps" size="sm" variant="bare">
                  {query.trim()
                    ? matches.map(row)
                    : [
                        <ListSection key="popular" label="Popular">
                          {popular.map(row)}
                        </ListSection>,
                        <ListSection key="all" label="All apps">
                          {apps.filter((entry) => !popular.includes(entry)).map(row)}
                        </ListSection>
                      ]}
                </List>
              </>
            );
          }
        },
        {
          title: "Configure",
          heading: app ? `Configure ${app}` : "Configure",
          summary: name || undefined,
          validate: () => {
            const fields = {
              name: name.trim() ? undefined : "Enter a name.",
              roleArn: roleArn.trim() ? undefined : "Enter the role ARN."
            };
            return Object.values(fields).some(Boolean) ? { fields } : true;
          },
          content: (
            <>
              <Field name="name" label="Name" description="Try prod-aws to see a failed connect." wide>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Field name="roleArn" label="Role ARN" wide>
                <Input value={roleArn} onChange={(event) => setRoleArn(event.target.value)} />
              </Field>
            </>
          )
        },
        {
          title: "Review",
          heading: "Review the connection",
          content: <p>Nothing is saved until you connect.</p>
        }
      ]}
    />
  );
}
