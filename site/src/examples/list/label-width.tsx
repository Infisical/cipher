import { type DataListItem, DataList } from "@infisical/cipher/ui/list";

const items: DataListItem[] = [
  ["TTL", "1 hour"],
  ["Max TTL", "24 hours"],
  ["Allowed environments", "development, staging, production"],
  [
    "Secret path",
    <code key="path">/payments-ledger/replication/eu-west-1/primary/credentials</code>
  ],
  ["MFA", "Required"],
  [
    "Trusted IP ranges",
    "10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 203.0.113.0/24, 198.51.100.0/24"
  ],
  ["Approvers", "Security team, Platform engineering on-call"]
];

export default function LabelWidth() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataList variant="inline" items={items} />
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <DataList variant="inline" labelWidth="text-min" items={items} />
        <figcaption className="text-muted-foreground text-xs">{'labelWidth="text-min"'}</figcaption>
      </figure>
    </div>
  );
}
