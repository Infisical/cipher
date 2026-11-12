import { useEffect, useState } from "react";

import { Grid } from "@infisical/cipher/ui/layout";
import { Progress, ProgressSteps } from "@infisical/cipher/ui/progress";

export default function Example() {
  const [synced, setSynced] = useState(9);
  useEffect(() => {
    const timer = setInterval(() => setSynced((value) => (value >= 14 ? 6 : value + 1)), 1600);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <Grid columns={2} gap={32}>
        <Progress
          label="Syncing to GitHub Actions"
          value={synced}
          max={14}
          valueLabel={`${synced} of 14`}
        />
        <Progress label="Checking 412 secrets for expiry" valueLabel="About 1 min" />
        <Progress label="Secrets" value={412} max={500} tone="auto" valueLabel="412 of 500" />
        <Progress
          label="Agent calls today"
          value={10400}
          max={10000}
          tone="auto"
          valueLabel="10,400 of 10,000, over"
        />
      </Grid>
      <ProgressSteps
        label="Rotating stripe_api_key"
        steps={["Generate", "Propagate", "Verify", "Revoke old"]}
        current={2}
      />
    </div>
  );
}
