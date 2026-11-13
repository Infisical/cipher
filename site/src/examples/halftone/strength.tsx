import { Card } from "@infisical/cipher/ui/card";
import { Halftone } from "@infisical/cipher/ui/halftone";
import { hueScope } from "@infisical/cipher/lib/hue";

const variants = [
  { label: "intensity 0.5", intensity: 0.5 },
  { label: "default", intensity: 1 },
  { label: "density 0.6", density: 0.6 },
  { label: "reach 120, depth 1", reach: 120, depth: 1 },
  { label: "seed alpha", seed: "alpha" },
  { label: "seed beta", seed: "beta" }
];

export default function Example() {
  return (
    <div
      {...hueScope(172, "pop")}
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8"
    >
      {variants.map(({ label, ...props }) => (
        <figure key={label} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Card
            variant="framed"
            footerPlacement="frame"
            title="payments-api"
            footer="3 environments"
            backdrop={<Halftone {...props} />}
          >
            Card checkout and refunds.
          </Card>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
