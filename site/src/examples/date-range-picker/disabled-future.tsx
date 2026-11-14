import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { DateRangePicker } from "@infisical/cipher/ui/date-range-picker";
import { Label } from "@infisical/cipher/ui/label";

export default function Example() {
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="range-past">Audit period</Label>
      <DateRangePicker
        id="range-past"
        value={range}
        onValueChange={setRange}
        disabled={{ after: new Date() }}
        placeholder="Up to today"
      />
    </div>
  );
}
