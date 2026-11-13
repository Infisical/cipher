import { Card } from "@infisical/cipher/ui/card";
import { Halftone } from "@infisical/cipher/ui/halftone";
import { Icon } from "@infisical/cipher/ui/icon";
import { hueScope, type HueLevel } from "@infisical/cipher/lib/hue";

const hues = [113.8, 56, 172, 305, 18, 152, 250];
const levels: HueLevel[] = ["subtle", "pop"];

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-8">
      {levels.map((level) => (
        <figure key={level} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-4">
            {hues.map((hue) => (
              <div key={hue} {...hueScope(hue, level)}>
                <Card
                  variant="framed"
                  footerPlacement="frame"
                  title={
                    <span className="inline-flex items-center gap-2">
                      <Icon name="key" size={18} className="text-(--v4-hue-icon)" />
                      {`Hue ${hue}`}
                    </span>
                  }
                  footer={
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-grid size-6 place-items-center bg-(--v4-hue-soft) text-(--v4-hue-icon)">
                        <Icon name="key" size={14} />
                      </span>
                      hue-soft tile
                    </span>
                  }
                  backdrop={<Halftone reach={160} />}
                />
              </div>
            ))}
          </div>
          <figcaption className="text-muted-foreground text-xs">{level}</figcaption>
        </figure>
      ))}
    </div>
  );
}
