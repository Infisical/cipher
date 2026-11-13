import { Card } from "@infisical/cipher/ui/card";
import { Halftone, type HalftoneProps } from "@infisical/cipher/ui/halftone";
import { hueScope, type HueLevel } from "@infisical/cipher/lib/hue";

const variants: { label: string; tone: HalftoneProps["tone"]; level?: HueLevel }[] = [
  { label: "hue, subtle", tone: "hue", level: "subtle" },
  { label: "hue, pop", tone: "hue", level: "pop" },
  { label: "hue outside a hue scope", tone: "hue" },
  { label: "accent", tone: "accent" },
  { label: "ink", tone: "ink" }
];

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      {variants.map(({ label, tone, level }) => (
        <figure
          key={label}
          {...(level ? hueScope(56, level) : {})}
          className="m-0 flex w-full min-w-0 flex-col gap-3"
        >
          <Card
            variant="framed"
            footerPlacement="frame"
            title="payments-api"
            footer="3 environments"
            backdrop={<Halftone tone={tone} />}
          >
            Card checkout and refunds.
          </Card>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
