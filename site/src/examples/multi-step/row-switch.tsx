import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { Switch } from "@infisical/cipher/ui/switch";
import { toast } from "@infisical/cipher/ui/sonner";

export default function Example() {
  const [targets, setTargets] = useState("10.0.0.0/24");
  const [name, setName] = useState("weekly-edge-scan");
  const [scheduled, setScheduled] = useState(true);
  const [notify, setNotify] = useState(false);
  return (
    <MultiStep
      variant="sheet"
      title="Add discovery job"
      trigger={<Button variant="outline">Add discovery job</Button>}
      completeLabel="Create job"
      onComplete={() => {
        toast("Discovery job created.");
      }}
      steps={[
        {
          title: "Targets",
          heading: "Scan targets",
          content: (
            <Field label="IP ranges">
              <Input value={targets} onChange={(event) => setTargets(event.target.value)} />
            </Field>
          )
        },
        {
          title: "Details",
          heading: "Job details",
          content: (
            <>
              <Field label="Name">
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </Field>
              <Switch
                layout="row"
                label="Scan on a schedule"
                description="Turn off to only scan when you start it."
                checked={scheduled}
                onCheckedChange={setScheduled}
              />
              <Switch
                layout="row"
                label="Notify on new certificates"
                checked={notify}
                onCheckedChange={setNotify}
              />
            </>
          )
        },
        {
          title: "Review",
          heading: "Review the job",
          description: `${name || "The job"} scans ${targets || "no targets"}${scheduled ? " once a day" : " when you start it"}.`
        }
      ]}
    />
  );
}
