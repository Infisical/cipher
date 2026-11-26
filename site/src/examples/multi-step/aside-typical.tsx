import * as React from "react";
import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Checkbox } from "@infisical/cipher/ui/checkbox";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const docs = "https://infisical.com/docs/integrations/secret-syncs";

const Flow = ({
  variant,
  trigger
}: {
  variant: "dialog" | "sheet";
  trigger: React.ReactElement;
}) => {
  const [environment, setEnvironment] = useState("production");
  const [path, setPath] = useState("/");
  const [region, setRegion] = useState("");
  const [regionError, setRegionError] = useState(false);
  const [initial, setInitial] = useState(true);
  const [name, setName] = useState("");
  return (
    <MultiStep
      variant={variant}
      layout="aside"
      title="AWS Secrets Manager sync"
      trigger={trigger}
      completeLabel="Create sync"
      onComplete={async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        toast(`Created ${name || "the sync"}.`);
      }}
      steps={[
        {
          title: "Source",
          summary: `${environment} ${path}`,
          aside: {
            description: "The environment and folder whose secrets Infisical sends to AWS.",
            docsHref: `${docs}/overview`,
            docsLabel: "How syncs work"
          },
          content: (
            <>
              <Field label="Environment">
                <Input
                  value={environment}
                  onChange={(event) => setEnvironment(event.target.value)}
                />
              </Field>
              <Field label="Secret path">
                <Input value={path} onChange={(event) => setPath(event.target.value)} />
              </Field>
            </>
          )
        },
        {
          title: "Destination",
          summary: region || undefined,
          validate: () => {
            setRegionError(!region.trim());
            return Boolean(region.trim());
          },
          aside: {
            description:
              "The AWS region that receives the secrets. The connection needs write access there.",
            docsHref: `${docs}/aws-secrets-manager`
          },
          content: (
            <Field label="Region" error={regionError ? "Enter the AWS region." : undefined}>
              <Input
                value={region}
                aria-invalid={regionError || undefined}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="us-east-1"
              />
            </Field>
          )
        },
        {
          title: "Sync options",
          aside: {
            description: "An initial sync overwrites values in AWS with the values in Infisical.",
            docsHref: `${docs}/overview#initial-sync`
          },
          content: (
            <Field label="Run an initial sync" orientation="horizontal">
              <Checkbox checked={initial} onCheckedChange={(value) => setInitial(value === true)} />
            </Field>
          )
        },
        {
          title: "Details",
          summary: name || undefined,
          aside: {
            description: "A name to find this sync by in the syncs list and in audit logs."
          },
          content: (
            <Field label="Sync name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="payments-prod"
              />
            </Field>
          )
        },
        {
          title: "Review",
          aside: {
            description: "Creating the sync starts it straight away.",
            docsHref: `${docs}/overview#sync-status`,
            docsLabel: "Sync status"
          },
          content: (
            <p className="m-0 text-sm">
              Sends {environment} {path} to AWS Secrets Manager in {region || "your region"}
              {initial ? ", starting with an initial sync" : ""}.
            </p>
          )
        }
      ]}
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <Flow variant="sheet" trigger={<Button variant="outline">Create a sync in a sheet</Button>} />
      <Flow
        variant="dialog"
        trigger={<Button variant="outline">Create a sync in a dialog</Button>}
      />
    </div>
  );
}
