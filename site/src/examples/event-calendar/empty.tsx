import { EventCalendar, type EventCalendarCategory } from "@infisical/cipher/ui/event-calendar";

const categories: EventCalendarCategory[] = [
  { label: "Rotation", tone: "info" },
  { label: "Reminder", tone: "warn" },
  { label: "Expiration", tone: "bad" }
];

export default function Example() {
  return <EventCalendar aria-label="Rotations and reminders" events={[]} categories={categories} />;
}
