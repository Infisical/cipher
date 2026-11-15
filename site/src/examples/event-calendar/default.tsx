import { useState } from "react";

import {
  EventCalendar,
  type EventCalendarCategory,
  type EventCalendarEvent
} from "@infisical/cipher/ui/event-calendar";

const categories: EventCalendarCategory[] = [
  { label: "Rotation", tone: "info" },
  { label: "Reminder", tone: "warn" },
  { label: "Expiration", tone: "bad" }
];

const now = new Date();
const on = (day: number) => new Date(now.getFullYear(), now.getMonth(), day);
const rotation = (id: string, day: number, label: string): EventCalendarEvent => ({
  id,
  date: on(day),
  label,
  tone: "info",
  category: "Rotation"
});
const reminder = (id: string, day: number, label: string): EventCalendarEvent => ({
  id,
  date: on(day),
  label,
  tone: "warn",
  category: "Reminder"
});

const events: EventCalendarEvent[] = [
  rotation("r1", 3, "postgres-prod"),
  reminder("m1", 5, "STRIPE_SECRET_KEY"),
  rotation("r2", 9, "aws-iam-deploy"),
  reminder("m2", 9, "SENDGRID_API_KEY"),
  { id: "e1", date: on(12), label: "GITHUB_APP_KEY", tone: "bad", category: "Expiration" },
  rotation("r3", now.getDate(), "redis-cache"),
  reminder("m3", now.getDate(), "OPENAI_API_KEY"),
  rotation("r4", now.getDate(), "mysql-billing"),
  rotation("r5", 19, "ldap-bind"),
  reminder("m4", 23, "SLACK_BOT_TOKEN"),
  rotation("r6", 26, "mongodb-atlas"),
  reminder("m5", 26, "DATADOG_API_KEY"),
  { id: "e2", date: on(26), label: "TLS_CERT", tone: "bad", category: "Expiration" },
  rotation("r7", 28, "azure-client-secret")
];

export default function Example() {
  const [selected, setSelected] = useState<EventCalendarEvent>();
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      <EventCalendar
        aria-label="Rotations and reminders"
        events={events}
        categories={categories}
        onEventSelect={setSelected}
      />
      <p role="status" className="text-muted-foreground text-xs">
        {selected ? `${selected.category}: ${selected.label}` : "No event selected"}
      </p>
    </div>
  );
}
