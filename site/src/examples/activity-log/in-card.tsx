import { type ActivityDay, ActivityLog } from "@infisical/cipher/patterns/activity-log";
import { Badge } from "@infisical/cipher/ui/badge";
import { Card } from "@infisical/cipher/ui/card";

const days: ActivityDay[] = [
  {
    label: "Today",
    events: [
      {
        id: "1",
        actor: "Sarah Lin",
        summary: "extended the license to Mar 4, 2027",
        badge: <Badge tone="ok">Renewed</Badge>,
        time: "10:42"
      },
      {
        id: "2",
        actor: "billing-sync",
        actorKind: "machine",
        summary: "updated the seat count to 120",
        time: "09:15"
      }
    ]
  },
  {
    label: "Nov 12",
    events: [
      {
        id: "3",
        actor: "Marcus Okonkwo-Fitzgerald",
        summary: "issued the license",
        time: "17:20"
      }
    ]
  }
];

export default function Example() {
  return (
    <Card variant="framed" title="Activity" flush className="w-full">
      <ActivityLog days={days} counts={false} />
    </Card>
  );
}
