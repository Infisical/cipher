import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts";

import * as UI from "@infisical/cipher/ui/chart";

const counts = [24, 19, 15, 12, 9, 6];
const data = UI.chartSeries.map((color, index) => ({
  series: `chart-${index + 1}`,
  count: counts[index],
  color
}));

export default function Example() {
  return (
    <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
      <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
        <UI.ChartContainer
          className="aspect-auto h-60"
          config={{ count: { label: "Certificates", color: "var(--chart-1)" } }}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 24, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid vertical={false} stroke="var(--cipher-line)" />
            <XAxis
              dataKey="series"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--cipher-ink)", style: { fill: "var(--cipher-ink)" } }}
            />
            <YAxis
              width={36}
              allowDecimals={false}
              domain={[0, 30]}
              tickCount={4}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--cipher-ink)", style: { fill: "var(--cipher-ink)" } }}
            />
            <Bar isAnimationActive={false} dataKey="count" maxBarSize={40}>
              {data.map((entry) => (
                <Cell key={entry.series} fill={entry.color} />
              ))}
              <LabelList dataKey="count" position="top" fill="var(--cipher-ink)" />
            </Bar>
          </BarChart>
        </UI.ChartContainer>
        <p className="text-sm">
          Synthetic certificate counts by issuer: chart-1 24, chart-2 19, chart-3 15, chart-4 12,
          chart-5 9, chart-6 6.
        </p>
      </div>
      <figcaption className="text-muted-foreground text-xs">
        {"chart-1 to chart-6 in series order"}
      </figcaption>
    </figure>
  );
}
