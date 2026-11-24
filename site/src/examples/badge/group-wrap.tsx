import { Badge, BadgeGroup } from "@infisical/cipher/ui/badge";
import { DataList } from "@infisical/cipher/ui/list";

const sets: { caption: string; roles: string[] }[] = [
  { caption: "One role", roles: ["Admin"] },
  { caption: "Several roles", roles: ["Viewer", "Member", "Billing", "Developer"] },
  {
    caption: "Long role names",
    roles: [
      "Payments release approver for production-eu-central",
      "Secret rotation operator",
      "Viewer"
    ]
  }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] items-start gap-x-6 gap-y-8">
      {sets.map((set) => (
        <figure key={set.caption} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <DataList
            variant="props"
            items={[
              ["Group", "platform-engineering"],
              [
                "Roles",
                <BadgeGroup key="roles" wrap>
                  {set.roles.map((role) => (
                    <Badge key={role}>{role}</Badge>
                  ))}
                </BadgeGroup>
              ]
            ]}
          />
          <figcaption className="text-muted-foreground text-xs">{set.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
