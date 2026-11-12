import { Badge } from "@infisical/cipher/ui/badge";
import { type DataListItem, DataList } from "@infisical/cipher/ui/list";

const items: DataListItem[] = [
  ["ID", <code key="id">4b1e8c2a-93f0-4d55-a1c6-0e7d2f9b3a11</code>],
  ["Managed by", "Organization", { span: "half" }],
  ["Organization role", "Member", { span: "half" }],
  [
    "Status",
    <Badge key="status" tone="ok" dot>
      Active
    </Badge>,
    { span: "half" }
  ],
  ["Delete protection", "On", { span: "half" }],
  ["Extended key usage", "Server authentication, client authentication"],
  ["Country", "CA", { span: "half" }],
  ["Last login", "Never"]
];

export default function Density() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataList variant="props" items={items} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <DataList variant="props" density="compact" items={items} />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"compact, half pairs and a lone half"}
        </figcaption>
      </figure>
    </div>
  );
}
