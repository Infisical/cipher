import { Card } from "@infisical/cipher/ui/card";
import { Halftone, type HalftoneAnchor } from "@infisical/cipher/ui/halftone";
import { hueScope } from "@infisical/cipher/lib/hue";

const anchors: HalftoneAnchor[] = ["top-right", "top-left", "bottom-right", "bottom-left"];

export default function Example() {
  return (
    <div
      {...hueScope(250, "pop")}
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8"
    >
      {anchors.map((anchor) => (
        <figure key={anchor} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <Card
            variant="framed"
            footerPlacement="frame"
            title="payments-api"
            footer="3 environments"
            backdrop={<Halftone anchor={anchor} />}
          >
            Card checkout and refunds.
          </Card>
          <figcaption className="text-muted-foreground text-xs">{anchor}</figcaption>
        </figure>
      ))}
    </div>
  );
}
