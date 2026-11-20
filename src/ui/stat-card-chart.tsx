import * as React from "react";
import { Area, AreaChart, YAxis } from "recharts";

import { ChartContainer } from "./chart";
import { StatCardChartHeight } from "./stat-card";

const headroom = 12;
const footroom = 6;

export type StatCardChartProps = {
  /** One number per point, oldest first. The last point sits on the card's right edge. */
  data: readonly number[];
  /** Names the series for assistive tech, such as Secret reads. */
  label: string;
  /** step holds each value until the next point, for counts that change in jumps. */
  curve?: "linear" | "step";
  /** What the trend shows, read in place of the chart, such as "Up from 8,120 to 12,480 over 7 days". Defaults to the first, last, lowest and highest values. */
  summary?: string;
};

const number = new Intl.NumberFormat();

/** An area chart for a StatCard's chart slot. Its fill reaches the band's bottom edge, the line keeps 12px of headroom and stays 6px above the bottom, and it takes the band's height. Inside hueScope it draws in the product's hue. */
export function StatCardChart({ data, label, curve = "linear", summary }: StatCardChartProps) {
  const height = React.useContext(StatCardChartHeight);
  const points = data.map((value) => ({ value }));
  const max = Math.max(...data, 0);
  const min = Math.min(...data, 0);
  const plot = height - headroom;
  const floor = max === min ? min - 1 : min - ((max - min) * footroom) / (plot - footroom);
  return (
    <ChartContainer
      config={{ value: { label, color: "var(--cipher-hue-icon, var(--chart-1))" } }}
      height={height}
      role="img"
      aria-label={`${label}: ${summary ?? describe(data)}`}
    >
      <AreaChart data={points} margin={{ top: headroom, right: 0, bottom: 0, left: 0 }}>
        <YAxis hide type="number" allowDataOverflow domain={[floor, max === min ? max + 1 : max]} />
        <Area
          dataKey="value"
          type={curve === "step" ? "stepAfter" : "linear"}
          stroke="var(--color-value)"
          strokeWidth={1.6}
          fill="var(--cipher-hue-fill, var(--chart-1))"
          fillOpacity={0.14}
          baseValue={floor}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const describe = (data: readonly number[]) =>
  data.length === 0
    ? "no data"
    : `${number.format(data[0])} to ${number.format(data[data.length - 1])}, low ${number.format(Math.min(...data))}, high ${number.format(Math.max(...data))}`;
