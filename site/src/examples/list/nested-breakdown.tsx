import { Badge } from "@infisical/cipher/ui/badge";
import { DataList } from "@infisical/cipher/ui/list";

const values = (items: string[]) => (
  <span>
    {items.map((item) => (
      <Badge key={item} tone="outline" mono>
        {item}
      </Badge>
    ))}
  </span>
);

export default function Example() {
  return (
    <div className="flex w-full max-w-xl min-w-0 flex-col gap-8">
      <DataList
        variant="props"
        items={[
          [
            "Common name",
            <DataList
              key="cn"
              variant="inline"
              items={[["Allowed", values(["*.example.com"])]]}
            />,
          ],
          [
            "DNS name",
            <DataList
              key="dns"
              variant="inline"
              items={[
                ["Required", values(["api.example.com"])],
                [
                  "Allowed",
                  values([
                    "*.internal.example.com",
                    "payments-ledger-replication.eu-west-1.example.com",
                    "*.staging.example.com",
                  ]),
                ],
                ["Denied", values(["*.corp.example.com"])],
              ]}
            />,
          ],
          ["Email", "None"],
        ]}
      />
      <DataList
        variant="meta"
        density="compact"
        items={[
          [
            "Key usage",
            <DataList
              key="ku"
              variant="inline"
              items={[
                ["Required", values(["Digital signature"])],
                ["Allowed", values(["Key encipherment", "Data encipherment"])],
              ]}
            />,
          ],
          ["Validity", "90 days"],
        ]}
      />
    </div>
  );
}
