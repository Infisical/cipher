import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { DateRangePicker, type DateRangePreset } from "@infisical/cipher/ui/date-range-picker";
import { Label } from "@infisical/cipher/ui/label";

const today = new Date();
today.setHours(0, 0, 0, 0);
const daysAgo = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);
const presets: DateRangePreset[] = [
  { label: "Today", range: { from: today, to: today } },
  { label: "Last 7 days", range: { from: daysAgo(6), to: today } },
  { label: "Last 30 days", range: { from: daysAgo(29), to: today } },
  { label: "This month", range: { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today } },
  { label: "Last 90 days", range: { from: daysAgo(89), to: today } }
];

export default function Example() {
  const [range, setRange] = useState<DateRange | undefined>(presets[1].range);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="range-presets">Activity</Label>
      <DateRangePicker
        id="range-presets"
        value={range}
        onValueChange={setRange}
        presets={presets}
        disabled={{ after: today }}
      />
    </div>
  );
}
