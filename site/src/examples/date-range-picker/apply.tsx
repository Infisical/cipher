import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { DateRangePicker, type DateRangePreset } from "@infisical/cipher/ui/date-range-picker";
import { Field } from "@infisical/cipher/ui/field";

const today = new Date();
today.setHours(0, 0, 0, 0);
const ahead = (days: number, months = 0) =>
  new Date(today.getFullYear(), today.getMonth() + months, today.getDate() + days);
const presets: DateRangePreset[] = [
  { label: "Next 7 days", range: { from: today, to: ahead(7) } },
  { label: "Next 30 days", range: { from: today, to: ahead(30) } },
  { label: "Next 90 days", range: { from: today, to: ahead(90) } },
  { label: "Next 6 months", range: { from: today, to: ahead(0, 6) } },
  { label: "Next 12 months", range: { from: today, to: ahead(0, 12) } }
];

export default function Example() {
  const [range, setRange] = useState<DateRange | undefined>(presets[1].range);
  return (
    <Field label="Expiry window">
      <DateRangePicker
        value={range}
        onValueChange={setRange}
        presets={presets}
        numberOfMonths={2}
        placeholder="Any expiry date"
      />
    </Field>
  );
}
