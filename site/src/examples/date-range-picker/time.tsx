import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { DateRangePicker, type DateRangePreset } from "@infisical/cipher/ui/date-range-picker";
import { Label } from "@infisical/cipher/ui/label";

const now = new Date();
now.setSeconds(0, 0);
const startOfDay = (daysAgo: number) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
const presets: DateRangePreset[] = [
  { label: "Last hour", range: { from: new Date(now.getTime() - 3_600_000), to: now } },
  { label: "Last 24 hours", range: { from: new Date(now.getTime() - 86_400_000), to: now } },
  { label: "Today", range: { from: startOfDay(0), to: now } },
  { label: "Last 7 days", range: { from: startOfDay(6), to: now } }
];

export default function Example() {
  const [empty, setEmpty] = useState<DateRange | undefined>();
  const [session, setSession] = useState<DateRange | undefined>({
    from: new Date(2026, 10, 3, 9, 0),
    to: new Date(2026, 10, 4, 17, 30)
  });
  const [long, setLong] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1, 0, 0),
    to: new Date(2026, 11, 31, 23, 59)
  });
  return (
    <div className="flex w-full min-w-0 flex-wrap items-end gap-6">
      <div className="flex max-w-full min-w-0 flex-col gap-2">
        <Label htmlFor="range-time-empty">Started</Label>
        <DateRangePicker
          id="range-time-empty"
          withTime
          value={empty}
          onValueChange={setEmpty}
          placeholder="Any time"
        />
      </div>
      <div className="flex max-w-full min-w-0 flex-col gap-2">
        <Label htmlFor="range-time-set">Session time</Label>
        <DateRangePicker
          id="range-time-set"
          withTime
          value={session}
          onValueChange={setSession}
          presets={presets}
        />
      </div>
      <div className="flex w-56 min-w-0 flex-col gap-2">
        <Label htmlFor="range-time-long">Retention window</Label>
        <DateRangePicker
          id="range-time-long"
          withTime
          value={long}
          onValueChange={setLong}
          numberOfMonths={2}
        />
      </div>
    </div>
  );
}
