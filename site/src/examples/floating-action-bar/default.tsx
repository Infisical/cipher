import { useState } from "react";

import { FloatingActionBar } from "@infisical/cipher/ui/floating-action-bar";
import { List, ListRow } from "@infisical/cipher/ui/list";
import { toast } from "@infisical/cipher/ui/sonner";

const secrets = ["stripe_api_key", "database_url", "sentry_dsn", "redis_password", "jwt_secret"];

export default function Example() {
  const [rows, setRows] = useState(secrets);
  const [selected, setSelected] = useState<string[]>(["stripe_api_key", "database_url"]);
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
            {rows.map((key) => (
              <ListRow key={key} value={key} label={key} title={<code>{key}</code>} />
            ))}
          </List>
          <FloatingActionBar
            count={selected.length}
            total={rows.length}
            onSelectAll={() => setSelected(rows)}
            onClear={() => setSelected([])}
            actions={[
              {
                label: "Move",
                icon: "folder",
                onClick: () => toast(`Ready to move ${selected.length}.`)
              },
              {
                label: "Delete",
                icon: "trash",
                danger: true,
                onClick: () => {
                  setRows(rows.filter((row) => !selected.includes(row)));
                  toast(`Deleted ${selected.length} secrets.`);
                  setSelected([]);
                }
              }
            ]}
            moreActions={[
              {
                label: "Download names",
                onClick: () => {
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(
                    new Blob([`${selected.join("\n")}\n`], { type: "text/plain" })
                  );
                  link.download = "secret-names.txt";
                  link.click();
                  URL.revokeObjectURL(link.href);
                  toast(`Downloaded ${selected.length} names.`);
                }
              }
            ]}
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground text-xs">{"Two of five selected"}</figcaption>
    </figure>
  );
}
