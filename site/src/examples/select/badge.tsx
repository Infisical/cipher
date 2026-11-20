import { useState } from "react";
import { type DateRange } from "react-day-picker";

import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Combobox } from "@infisical/cipher/ui/combobox";
import { DateRangePicker } from "@infisical/cipher/ui/date-range-picker";
import { Select, type SelectOption } from "@infisical/cipher/ui/select";

const current = (
  <Badge tone="info" collapse>
    Current
  </Badge>
);

const periods: SelectOption[] = [
  { value: "2026-11", label: "Nov 19 to Nov 30, 2026", badge: current },
  { value: "2026-10", label: "Oct 19 to Nov 18, 2026" },
  { value: "2026-09", label: "Sep 19 to Oct 18, 2026" }
];
const longPeriods: SelectOption[] = [
  {
    value: "2026-11",
    label: "Enterprise annual commitment, Nov 19, 2026 to Nov 18, 2027",
    badge: current
  },
  { value: "2025-11", label: "Enterprise annual commitment, Nov 19, 2025 to Nov 18, 2026" }
];

function Row({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2">{children}</div>
      <figcaption className="text-muted-foreground text-xs">{caption}</figcaption>
    </figure>
  );
}

export default function Example() {
  const [period, setPeriod] = useState("2026-11");
  const [longPeriod, setLongPeriod] = useState("2026-11");
  const [account, setAccount] = useState("2026-11");
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 10, 19),
    to: new Date(2026, 10, 30)
  });
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      <Row caption="No periods yet">
        <Select label="Billing period" width="md" options={[]} placeholder="No billing periods" />
        <Button variant="outline">Adjust usage</Button>
      </Row>
      <Row caption="The current period carries its badge into the trigger">
        <div className="min-w-0 max-w-96 grow basis-72">
          <Select
            label="Billing period"
            icon="calendar"
            options={periods}
            value={period}
            onValueChange={setPeriod}
          />
        </div>
        <Button variant="outline">Adjust usage</Button>
      </Row>
      <Row caption="A long label truncates before the badge collapses">
        <Select
          label="Billing period"
          width="md"
          icon="calendar"
          options={longPeriods}
          value={longPeriod}
          onValueChange={setLongPeriod}
        />
        <Button variant="outline">Adjust usage</Button>
      </Row>
      <Row caption="Combobox, single selection">
        <Combobox
          label="Billing period"
          width="md"
          options={periods}
          value={account}
          onValueChange={setAccount}
        />
      </Row>
      <Row caption="DateRangePicker with a badge for the running period">
        <DateRangePicker
          aria-label="Billing period"
          value={range}
          onValueChange={setRange}
          badge={current}
        />
        <Button variant="outline">Adjust usage</Button>
      </Row>
    </div>
  );
}
