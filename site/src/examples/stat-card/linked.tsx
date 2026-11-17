import { Halftone } from "@infisical/cipher/ui/halftone";
import { Grid } from "@infisical/cipher/ui/layout";
import { StatCard } from "@infisical/cipher/ui/stat-card";

export default function Example() {
  return (
    <Grid data-testid="linked-stat-cards" className="w-full">
      <StatCard
        label="Total accounts"
        value="1,284"
        icon="building"
        note="vs last month"
        link={{ href: "#/stat-card-linked/accounts" }}
      />
      <StatCard
        label="Total licenses"
        value="3,902"
        icon="key"
        backdrop={<Halftone seed="licenses" />}
        link={{ href: "#/stat-card-linked/licenses" }}
      />
      <StatCard
        variant="plain"
        label="Suspended"
        value="7"
        icon="lock"
        tone="bad"
        link={{ href: "#/stat-card-linked/suspended" }}
      />
      <StatCard
        variant="plain"
        label="In grace"
        value="12"
        icon="clock"
        tone="warn"
        backdrop={<Halftone seed="grace" />}
        link={{ href: "#/stat-card-linked/grace" }}
      />
    </Grid>
  );
}
