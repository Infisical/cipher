import { hueScope } from "@infisical/cipher/lib/hue";
import { Button } from "@infisical/cipher/ui/button";
import { StatCard } from "@infisical/cipher/ui/stat-card";
import { StatCardChart } from "@infisical/cipher/ui/stat-card-chart";

const reads = [8120, 9340, 8710, 10220, 11890, 10940, 12480];
const expiring = [2, 2, 3, 3, 5, 5, 4, 6, 6, 9, 9, 11];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          {...hueScope(250)}
          label="Secret reads"
          value="12,480"
          note="Last 7 days"
          link={{ href: "#/components/stat-card" }}
          chartPlacement="bleed"
          chart={
            <StatCardChart
              data={reads}
              label="Secret reads per day"
              summary="Up from 8,120 to 12,480 over 7 days"
            />
          }
        />
        <StatCard
          {...hueScope(25)}
          label="Secret scanning findings"
          value="23"
          note="Across 4 data sources"
          footerPlacement="frame"
          footer={
            <>
              <span>3 new this week</span>
              <Button asChild variant="outline">
                <a href="#/components/stat-card">Review findings</a>
              </Button>
            </>
          }
        />
        <StatCard
          label="Certificates expiring"
          value="Not set up"
          note="Track certificates before they expire."
          action={<Button variant="outline">Add a certificate</Button>}
        />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          {...hueScope(150)}
          label="Certificates expiring across every production and staging environment"
          value="1,204,388"
          note="In the next 30 days, grouped by issuing authority"
          chartPlacement="bleed"
          chartSize="md"
          chart={<StatCardChart data={expiring} label="Certificates expiring" curve="step" />}
        />
        <StatCard
          label="Machine identities"
          value="318"
          delta="+12"
          trend="up"
          note="vs last week"
          chart={<StatCardChart data={[96, 142, 131, 204, 262, 318]} label="Machine identities" />}
        />
      </div>
    </div>
  );
}
