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
const kinds = [
  { tone: "info", category: "Rotation" },
  { tone: "warn", category: "Reminder" },
  { tone: "bad", category: "Expiration" }
] as const;
const names = [
  "production-postgres-primary-cluster-us-east-1-credentials",
  "STRIPE_RESTRICTED_SECRET_KEY_FOR_BILLING_RECONCILIATION_WORKER",
  "aws-iam-access-key-ci-deploy-role",
  "GOOGLE_SERVICE_ACCOUNT_JSON_ANALYTICS_EXPORT",
  "azure-ad-application-client-secret-internal-portal",
  "TWILIO_AUTH_TOKEN"
];

const events: EventCalendarEvent[] = Array.from({ length: 28 }, (_, index) => index + 1).flatMap(
  (day) =>
    Array.from({ length: day % 5 === 0 ? 14 : (day % 4) + 1 }, (_, index) => {
      const kind = kinds[(day + index) % kinds.length];
      return {
        id: `${day}-${index}`,
        date: on(day),
        label: names[(day * 3 + index) % names.length],
        tone: kind.tone,
        category: kind.category
      };
    })
);

export default function Example() {
  return (
    <EventCalendar
      aria-label="Rotations and reminders"
      events={events}
      categories={categories}
      loading
    />
  );
}
