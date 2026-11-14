import { useState } from "react";

import { type ActivityDay, ActivityLog } from "@infisical/cipher/patterns/activity-log";
import { Badge } from "@infisical/cipher/ui/badge";

const firstPage: ActivityDay[] = [
  {
    label: "Today",
    events: [
      {
        id: "1",
        actor: "Sarah Lin",
        summary: (
          <>
            updated <code>stripe_api_key</code>
          </>
        ),
        badge: <Badge tone="warn">Production</Badge>,
        time: "10:42"
      },
      {
        id: "2",
        actor: "github-deployer",
        actorKind: "machine",
        summary: "read 14 secrets in production",
        time: "10:31"
      },
      {
        id: "3",
        actor: "release-notes-agent",
        actorKind: "agent",
        summary: "requested read access to staging",
        badge: <Badge tone="info">Pending</Badge>,
        time: "09:58"
      }
    ]
  },
  {
    label: "Yesterday",
    events: [
      {
        id: "4",
        actor: "Marcus Okonkwo-Fitzgerald",
        summary: "approved a change to production",
        time: "17:20"
      }
    ]
  }
];
const olderDay: ActivityDay = {
  label: "Oct 15",
  events: [
    {
      id: "5",
      actor: "Priya Raman",
      summary: (
        <>
          created <code>sentry_dsn</code>
        </>
      ),
      time: "14:05"
    },
    {
      id: "6",
      actor: "Sarah Lin",
      summary: "invited Priya Raman",
      time: "13:50"
    }
  ]
};

export default function Example() {
  const [days, setDays] = useState(firstPage);
  const [keyset, setKeyset] = useState(firstPage.slice(0, 1));
  const [loading, setLoading] = useState(false);
  const loadLater = (next: () => void) => {
    setLoading(true);
    window.setTimeout(() => {
      next();
      setLoading(false);
    }, 1200);
  };
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ActivityLog
            days={days}
            total={6}
            loading={loading}
            onLoadMore={() => loadLater(() => setDays([...firstPage, olderDay]))}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Grouped by day, with a total and load more"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ActivityLog
            label="License activity"
            days={keyset}
            hasMore={keyset.length < 2}
            onLoadMore={() => setKeyset(firstPage)}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Keyset pages: hasMore without a total"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <ActivityLog days={[]} empty="No changes to this license yet" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Custom empty state"}</figcaption>
      </figure>
    </div>
  );
}
