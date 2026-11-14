import { Badge } from "@infisical/cipher/ui/badge";
import { List, ListRow } from "@infisical/cipher/ui/list";

const accounts = [
  { id: "acme", name: "Acme Corp", detail: "3 licenses", tone: "ok" as const, status: "Active" },
  { id: "globex", name: "Globex", detail: "1 license", tone: "soft" as const, status: "Trial" },
  { id: "initech", name: "Initech", detail: "No licenses", tone: "soft" as const, status: "Lead" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Accounts" title="Accounts" count="3" refreshing>
            {accounts.map((account) => (
              <ListRow
                key={account.id}
                value={account.id}
                label={account.name}
                title={account.name}
                description={account.detail}
                link={{ href: "#/components/list" }}
                badge={<Badge tone={account.tone}>{account.status}</Badge>}
              />
            ))}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"refreshing: rows stay while a search or filter refetches"}
        </figcaption>
      </figure>
    </div>
  );
}
