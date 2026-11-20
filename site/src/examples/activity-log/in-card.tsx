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

const singleDays: ActivityDay[] = [
  ["Nov 18", "Sarah Lin", "added 5 seats"],
  ["Nov 15", "billing-sync", "renewed the invoice"],
  ["Nov 11", "Marcus Okonkwo-Fitzgerald", "changed the plan to Enterprise"],
  ["Nov 6", "Sarah Lin", "removed 2 seats"],
  ["Oct 30", "billing-sync", "marked the invoice paid"],
  ["Oct 24", "Priya Raman", "issued the license"]
].map(([label, actor, summary], index) => ({
  label,
  events: [{ id: String(index), actor, summary, time: "12:00" }]
}));

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <Card variant="framed" title="Activity" flush className="w-full">
        <ActivityLog days={days} counts={false} />
      </Card>
      <Card variant="framed" title="Activity" flush className="w-full">
        <ActivityLog days={singleDays} counts={false} />
      </Card>
    </div>
  );
}
