import { useState } from "react";

import { FloatingActionBar } from "@infisical/cipher/ui/floating-action-bar";
import { List, ListRow } from "@infisical/cipher/ui/list";
import { toast } from "@infisical/cipher/ui/sonner";

const secrets = [
  { key: "stripe_api_key", environment: "production" },
  { key: "database_url", environment: "staging" },
  { key: "sentry_dsn", environment: "production" }
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>(["stripe_api_key", "database_url"]);
  const environments = new Set(
    secrets.filter((secret) => selected.includes(secret.key)).map((secret) => secret.environment)
  );
  const reason = environments.size > 1 ? "Select secrets from one environment to copy" : undefined;
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <div className="relative isolate h-[600px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
          <List
            label="Secrets"
            title="Secrets"
            selection="multiple"
            selectedIds={selected}
            onSelectionChange={setSelected}
          >
            {secrets.map((secret) => (
              <ListRow
                key={secret.key}
                value={secret.key}
                label={secret.key}
                title={<code>{secret.key}</code>}
                meta={secret.environment}
              />
            ))}
          </List>
          <FloatingActionBar
            count={selected.length}
            onClear={() => setSelected([])}
            actions={[
              {
                label: "Copy to new source",
                icon: "copy",
                disabledReason: reason,
                onClick: () => toast(`Ready to copy ${selected.length} secrets.`)
              },
              {
                label: "Delete",
                icon: "trash",
                danger: true,
                onClick: () => toast(`Ready to delete ${selected.length} secrets.`)
              }
            ]}
            moreActions={[
              {
                label: "Export as .env",
                disabledReason: reason && "Select secrets from one environment to export",
                onClick: () => toast(`Ready to export ${selected.length} secrets.`)
              }
            ]}
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"Copy blocked until the selection shares one environment"}
      </figcaption>
    </figure>
  );
}
