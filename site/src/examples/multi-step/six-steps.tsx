import { Button } from "@infisical/cipher/ui/button";
import { Field } from "@infisical/cipher/ui/field";
import { Input } from "@infisical/cipher/ui/input";
import { MultiStep, Steps } from "@infisical/cipher/ui/multi-step";
import { toast } from "@infisical/cipher/ui/sonner";

const short = ["Source", "Target", "Permissions", "Schedule", "Alerts", "Review"].map((title) => ({
  title
}));
const long = [
  "Source environment and secret path",
  "Destination Kubernetes cluster",
  "Machine identity permissions",
  "ServiceAccountTokenReviewer",
  "Rotation schedule and notifications",
  "Review and confirm the sync"
].map((title) => ({ title }));

const states = [
  { name: "empty", steps: short, current: 0 },
  { name: "typical", steps: short, current: 2 },
  { name: "stressed", steps: long, current: 3 }
];
const widths = [
  { name: "390px", width: 390 },
  { name: "560px", width: 560 },
  { name: "full width", width: undefined }
];

const flow = long.map(({ title }) => ({
  title,
  content: (
    <Field label="Name">
      <Input placeholder="production-sync" />
    </Field>
  )
}));

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      <div className="flex flex-wrap gap-3">
        <MultiStep
          title="Set up a Kubernetes sync"
          steps={flow}
          defaultStep={2}
          completeLabel="Create sync"
          onComplete={() => {
            toast("Sync created.");
          }}
          trigger={<Button variant="outline">Open in a dialog</Button>}
        />
        <MultiStep
          variant="sheet"
          title="Set up a Kubernetes sync"
          steps={flow}
          defaultStep={2}
          completeLabel="Create sync"
          onComplete={() => {
            toast("Sync created.");
          }}
          trigger={<Button variant="outline">Open in a sheet</Button>}
        />
      </div>
      {states.map((state) => (
        <div key={state.name} className="flex w-full min-w-0 flex-col gap-4">
          {widths.map((frame) => (
            <figure
              key={frame.name}
              className="m-0 flex w-full min-w-0 flex-col gap-3"
              style={{ maxWidth: frame.width }}
            >
              <Steps steps={state.steps} current={state.current} label="Kubernetes sync steps" />
              <figcaption className="text-muted-foreground text-xs">
                {`${state.name}, ${frame.name}`}
              </figcaption>
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
