import { Button } from "@infisical/cipher/ui/button";
import { Item, ItemGroup, Media } from "@infisical/cipher/ui/item";

const rows = [
  {
    icon: "terminal",
    tone: "bad",
    title: "Break-glass access to prod-postgres-eu",
    description: "Leo Park. Incident 2291. Expires in 40 min.",
    meta: "4m"
  },
  {
    icon: "key",
    tone: "ok",
    title: "12 secrets changed in ledger-core, production",
    description: "Dana Wu. Needs 2 approvals.",
    meta: "12m"
  },
  {
    icon: "cert",
    tone: "warn",
    title: "api.acme.com certificate request",
    description: "deploy-bot. Profile web-tls.",
    meta: "1h"
  }
] as const;

const Approvals = ({ wrap = false }: { wrap?: boolean }) => (
  <ItemGroup>
    {rows.map((row) => (
      <Item
        key={row.title}
        truncate={!wrap}
        variant="outline"
        media={<Media icon={row.icon} tone={row.tone} />}
        title={row.title}
        description={row.description}
        meta={row.meta}
        actions={
          <>
            <Button variant="outline">Review</Button>
            <Button>Approve</Button>
          </>
        }
      />
    ))}
  </ItemGroup>
);

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Approvals />
        <figcaption className="text-muted-foreground text-xs">{"Inline: actions share the row"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-sm min-w-0 flex-col gap-3">
        <Approvals />
        <figcaption className="text-muted-foreground text-xs">{"Stacked: actions on their own row"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-xs min-w-0 flex-col gap-3">
        <Approvals wrap />
        <figcaption className="text-muted-foreground text-xs">{"Stacked, wrapping titles"}</figcaption>
      </figure>
    </div>
  );
}
