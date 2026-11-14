import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import * as UI from "@infisical/cipher/ui/chart";

const data = [
  { month: "Jun", seats: 120 },
  { month: "Jul", seats: 132 },
  { month: "Aug", seats: 128 },
  { month: "Sep", seats: 151 },
  { month: "Oct", seats: 164 },
  { month: "Nov", seats: 171 }
];
const config = { seats: { label: "Seats", color: "var(--cipher-chart-1)" } };

const Seats = () => (
  <AreaChart accessibilityLayer data={data} margin={{ top: 8, right: 12, bottom: 0, left: 12 }}>
    <CartesianGrid vertical={false} stroke="var(--cipher-line)" />
    <XAxis dataKey="month" tickLine={false} axisLine={false} />
    <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
    <Area
      isAnimationActive={false}
      dataKey="seats"
      type="monotone"
      fill="var(--color-seats)"
      fillOpacity={0.2}
      stroke="var(--color-seats)"
    />
  </AreaChart>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure aria-label="Seats per month" className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <UI.ChartContainer height={160} config={config}>
            <Seats />
          </UI.ChartContainer>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"height 160"}</figcaption>
      </figure>
      <figure aria-label="Seats per month" className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <UI.ChartContainer aspect={4} config={config}>
            <Seats />
          </UI.ChartContainer>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"aspect 4"}</figcaption>
      </figure>
    </div>
  );
}
