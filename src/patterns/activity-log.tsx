import * as React from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { List, ListRow, ListSection } from "../ui/list";

import styles from "./patterns.module.css";

export interface ActivityEvent {
  id: string;
  actor: string;
  actorKind?: "person" | "machine" | "agent";
  /** What the actor did, written to follow the actor's name: "updated stripe_api_key". */
  summary: React.ReactNode;
  time: string;
  /** Badges beside the summary, such as the environment or the result of the change. */
  badge?: React.ReactNode;
}
export interface ActivityDay {
  label: string;
  events: readonly ActivityEvent[];
}

export type ActivityLogProps = {
  days: readonly ActivityDay[];
  /** Every event that matches, for the "Showing x of y" footer. Leave it out for keyset APIs that only know whether more exist. */
  total?: number;
  /** Whether another page exists. Defaults to fewer events shown than total. */
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  label?: string;
  /** What renders when there are no events. */
  empty?: React.ReactNode;
};

const kindLabel = { person: "", machine: "Machine", agent: "Agent" } as const;
const plural = (count: number) => `${count} ${count === 1 ? "event" : "events"}`;

export const ActivityLog = ({
  days,
  total,
  hasMore,
  loading = false,
  onLoadMore,
  label = "Activity",
  empty = "No activity yet"
}: ActivityLogProps) => {
  const shown = days.reduce((sum, day) => sum + day.events.length, 0);
  const more = hasMore ?? (total !== undefined && shown < total);
  let footer: React.ReactNode;
  if (more && onLoadMore)
    footer = (
      <Button variant="outline" size="sm" loading={loading} onClick={onLoadMore}>
        Load more
      </Button>
    );
  else if (total !== undefined) footer = `Showing ${shown} of ${total} events`;
  else if (shown > 0) footer = `Showing ${plural(shown)}`;
  return (
    <div data-slot="activity-log">
      <List
        label={label}
        variant="plain"
        size="sm"
        loading={loading}
        empty={empty}
        footer={footer}
      >
        {days.map((day) => (
          <ListSection key={day.label} label={day.label} meta={plural(day.events.length)}>
            {day.events.map((event) => {
              const kind = event.actorKind ?? "person";
              const badges = (kind !== "person" || event.badge) && (
                <span className={styles.activityBadges}>
                  {kind !== "person" && <Badge>{kindLabel[kind]}</Badge>}
                  {event.badge}
                </span>
              );
              return (
                <ListRow
                  key={event.id}
                  value={event.id}
                  label={event.actor}
                  title={
                    <>
                      <span data-slot="activity-actor" className={styles.activityActor}>
                        {event.actor}
                      </span>{" "}
                      <span className={styles.activitySummary}>{event.summary}</span>
                    </>
                  }
                  badge={badges || undefined}
                  meta={event.time}
                />
              );
            })}
          </ListSection>
        ))}
      </List>
    </div>
  );
};
