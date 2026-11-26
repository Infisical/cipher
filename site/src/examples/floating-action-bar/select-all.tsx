import { useRef, useState } from "react";

import { FloatingActionBar } from "@infisical/cipher/ui/floating-action-bar";
import { List, ListRow } from "@infisical/cipher/ui/list";
import { toast } from "@infisical/cipher/ui/sonner";

const LIMIT = 1000;
const TOTAL = 2418;
const page = [
  "stripe_api_key",
  "database_url",
  "sentry_dsn",
  "redis_password",
  "billing_reconciliation_worker_eu_central_production_replica_token"
];
const firstThousand = [
  ...page,
  ...Array.from({ length: LIMIT - page.length }, (_, index) => `secret_${index + 1}`)
];

export default function Example() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const pending = useRef<number | undefined>(undefined);
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <div className="relative isolate h-[480px] w-full min-w-0 [transform:translateZ(0)] overflow-auto">
          <List
            label="Secrets"
            title="Secrets"
            selection="multiple"
            selectedIds={selected.filter((id) => page.includes(id))}
            onSelectionChange={(ids) =>
              setSelected((current) => [...current.filter((id) => !page.includes(id)), ...ids])
            }
          >
            {page.map((key) => (
              <ListRow key={key} value={key} label={key} title={<code>{key}</code>} />
            ))}
          </List>
          <FloatingActionBar
            count={selected.length}
            total={LIMIT}
            selectAllLabel={`Select first ${LIMIT.toLocaleString("en-US")}`}
            selectAllLoading={loading}
            onSelectAll={() => {
              setLoading(true);
              pending.current = window.setTimeout(() => {
                setLoading(false);
                setSelected(firstThousand);
              }, 1500);
            }}
            onClear={() => {
              window.clearTimeout(pending.current);
              setLoading(false);
              setSelected([]);
            }}
            actions={[
              {
                label: "Delete",
                icon: "trash",
                danger: true,
                onClick: () => toast(`Ready to delete ${selected.length} secrets.`)
              }
            ]}
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {`selectAllLabel caps a server-backed Select all at ${LIMIT.toLocaleString("en-US")} of ${TOTAL.toLocaleString("en-US")}, and selectAllLoading spins while the ids load`}
      </figcaption>
    </figure>
  );
}
