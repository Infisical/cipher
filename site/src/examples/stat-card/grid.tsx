import { Grid, Stack } from "@infisical/cipher/ui/layout";
import { StatCard } from "@infisical/cipher/ui/stat-card";

export default function Example() {
  return (
    <Stack gap={24} className="w-full min-w-0">
      <Grid columns={3} gap={16}>
        <StatCard
          label="Certificates expiring in 30 days"
          value="1,284"
          delta="+12%"
          trend="up"
          note="vs last month"
        />
        <StatCard label="Revoked" value="38" />
        <StatCard
          label="Issued by the internal intermediate certificate authority"
          value="$1,240,000"
          delta="-3%"
          trend="down"
          note="Includes renewals pending approval"
        />
      </Grid>
      <Grid columns={2} gap={16}>
        <StatCard label="Active trials" value="42" />
        <StatCard label="ARR on conversion" value="$1,240,000" delta="-3%" trend="down" />
      </Grid>
    </Stack>
  );
}
