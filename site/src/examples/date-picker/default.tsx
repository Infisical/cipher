import { useState } from "react";

import { DatePicker, type DatePickerPreset } from "@infisical/cipher/ui/date-picker";
import { Field } from "@infisical/cipher/ui/field";

const today = new Date();
today.setHours(0, 0, 0, 0);
const daysFromToday = (days: number) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
const trialPresets: DatePickerPreset[] = [7, 14, 30, 60].map((days) => ({
  label: `In ${days} days`,
  date: daysFromToday(days)
}));

export default function Example() {
  const [empty, setEmpty] = useState<Date | undefined>();
  const [trialEnd, setTrialEnd] = useState<Date | undefined>(daysFromToday(14));
  return (
    <div className="grid w-full min-w-0 grid-cols-2 items-start gap-6">
      <Field label="Retirement date" optional>
        <DatePicker value={empty} onValueChange={setEmpty} />
      </Field>
      <Field label="Trial ends">
        <DatePicker
          value={trialEnd}
          onValueChange={setTrialEnd}
          presets={trialPresets}
          disabled={{ before: today }}
        />
      </Field>
    </div>
  );
}
