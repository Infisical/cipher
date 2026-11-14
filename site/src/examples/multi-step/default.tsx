import * as React from "react";
import { useState } from "react";

import { Button } from "@infisical/cipher/ui/button";
import { Checkbox } from "@infisical/cipher/ui/checkbox";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const useConnection = () => {
  const [team, setTeam] = useState("");
  const [teamError, setTeamError] = useState(false);
  const [preview, setPreview] = useState(true);
  const [overwrite, setOverwrite] = useState(false);
  return [
    {
      title: "Team",
      heading: "Pick the Vercel team",
      description: "Infisical syncs secrets into this team's projects.",
      summary: team || undefined,
      validate: () => {
        setTeamError(!team.trim());
        return Boolean(team.trim());
      },
      content: (
        <Field label="Team slug" error={teamError ? "Enter the team slug." : undefined}>
          <Input
            value={team}
            aria-invalid={teamError || undefined}
            onChange={(event) => setTeam(event.target.value)}
            placeholder="acme"
          />
        </Field>
      )
    },
    {
      title: "Environments",
      heading: "Choose environments",
      description: "Production always syncs.",
      content: (
        <Field label="Also sync preview deployments" orientation="horizontal">
          <Checkbox checked={preview} onCheckedChange={(value) => setPreview(value === true)} />
        </Field>
      )
    },
    {
      title: "Review",
      heading: "Review the connection",
      description: `Connects ${team || "your team"} and syncs ${preview ? "2" : "1"} environments.`,
      disabledReason: overwrite ? undefined : "Confirm that Infisical may overwrite existing variables.",
      content: (
        <Field label="Overwrite existing Vercel variables" orientation="horizontal">
          <Checkbox
            checked={overwrite}
            onCheckedChange={(value) => setOverwrite(value === true)}
          />
        </Field>
      )
    }
  ];
};

const Connect = ({
  variant,
  trigger,
  onDone
}: {
  variant: "dialog" | "sheet" | "page";
  trigger?: React.ReactElement;
  onDone: () => void;
}) => (
  <MultiStep
    variant={variant}
    title="Connect Vercel"
    steps={useConnection()}
    completeLabel="Connect"
    onComplete={onDone}
    trigger={trigger}
  />
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Connect
            variant="dialog"
            onDone={() => toast("Vercel connected from the dialog.")}
            trigger={<Button variant="outline">Connect Vercel</Button>}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"dialog"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <Connect
            variant="sheet"
            onDone={() => toast("Vercel connected from the sheet.")}
            trigger={<Button variant="outline">Open in a sheet</Button>}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"sheet"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Connect variant="page" onDone={() => toast("Vercel connected from the page.")} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"page"}</figcaption>
      </figure>
    </div>
  );
}
