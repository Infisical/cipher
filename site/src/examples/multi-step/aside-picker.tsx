import * as React from "react";
import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { Media } from "@infisical/cipher/ui/item";
import { List, ListRow } from "@infisical/cipher/ui/list";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const destinations = ["AWS Secrets Manager", "GitHub", "Vercel", "Azure Key Vault", "Cloudflare"];
const docs = "https://infisical.com/docs/integrations/secret-syncs";

const Flow = ({
  variant,
  trigger
}: {
  variant: "dialog" | "sheet";
  trigger: React.ReactElement;
}) => {
  const [destination, setDestination] = useState<string>();
  const [path, setPath] = useState("/");
  const [name, setName] = useState("");
  const reset = () => {
    setDestination(undefined);
    setPath("/");
    setName("");
  };
  const provider = {
    title: "Destination",
    summary: destination,
    footer: false as const,
    render: ({ next }: { next: () => void }) => (
      <List label="Destinations" size="sm" variant="bare">
        {destinations.map((entry) => (
          <ListRow
            key={entry}
            value={entry}
            label={entry}
            title={entry}
            media={<Media size="sm">{entry.slice(0, 1)}</Media>}
            current={destination === entry}
            onClick={() => {
              setDestination(entry);
              next();
            }}
          />
        ))}
      </List>
    )
  };
  return (
    <MultiStep
      variant={variant}
      layout="aside"
      title={destination ? `${destination} sync` : "Choose a destination"}
      description={destination ? undefined : "You can't change the destination later."}
      media={destination ? <Media size="sm">{destination.slice(0, 1)}</Media> : undefined}
      trigger={trigger}
      completeLabel="Create sync"
      onCancel={reset}
      onComplete={() => {
        toast(`Created ${name || "the sync"}.`);
        reset();
      }}
      steps={
        destination
          ? [
              provider,
              {
                title: "Source",
                summary: path,
                aside: {
                  description: `The folder whose secrets Infisical sends to ${destination}.`,
                  docsHref: `${docs}/overview`,
                  docsLabel: "How syncs work"
                },
                content: (
                  <Field label="Secret path">
                    <Input value={path} onChange={(event) => setPath(event.target.value)} />
                  </Field>
                )
              },
              {
                title: "Details",
                aside: { description: "A name to find this sync by in the syncs list." },
                content: (
                  <Field label="Sync name">
                    <Input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="payments-prod"
                    />
                  </Field>
                )
              }
            ]
          : [provider]
      }
    />
  );
};

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-wrap items-start gap-3">
      <Flow
        variant="sheet"
        trigger={<Button variant="outline">Pick a destination in a sheet</Button>}
      />
      <Flow
        variant="dialog"
        trigger={<Button variant="outline">Pick a destination in a dialog</Button>}
      />
    </div>
  );
}
