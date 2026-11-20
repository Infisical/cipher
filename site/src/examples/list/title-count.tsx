import { List, ListRow } from "@infisical/cipher/ui/list";

const accounts = [
  { id: "acme", name: "Acme Corp", detail: "Renews in 12 days" },
  { id: "globex", name: "Globex", detail: "Suspended for a failed payment" },
  { id: "initech", name: "Initech", detail: "Trial ends tomorrow" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List
            label="Needs attention"
            title="Needs attention"
            count={0}
            countPlacement="title"
            empty="Nothing needs attention."
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"empty"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List label="Needs attention" title="Needs attention" count={3} countPlacement="title">
            {accounts.map((account) => (
              <ListRow
                key={account.id}
                value={account.id}
                label={account.name}
                title={account.name}
                description={account.detail}
                link={{ href: "#/components/list" }}
              />
            ))}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"countPlacement: title"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <List
            label="Accounts that need attention"
            title="Accounts that need attention before their renewal date"
            count={1284}
            countPlacement="title"
          >
            {accounts.map((account) => (
              <ListRow
                key={account.id}
                value={account.id}
                label={account.name}
                title={account.name}
                description={account.detail}
                link={{ href: "#/components/list" }}
              />
            ))}
          </List>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"long title, large count"}
        </figcaption>
      </figure>
    </div>
  );
}
