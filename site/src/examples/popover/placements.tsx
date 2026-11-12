import { Button } from "@infisical/cipher/ui/button";
import * as UI from "@infisical/cipher/ui/popover";

const placements = [
  { side: "top", align: "start" },
  { side: "right", align: "center" },
  { side: "bottom", align: "end" },
  { side: "left", align: "center" }
] as const;
export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      {placements.map(({ side, align }) => (
        <UI.Popover key={side}>
          <UI.PopoverTrigger asChild>
            <Button variant="outline">
              {side} / {align}
            </Button>
          </UI.PopoverTrigger>
          <UI.PopoverContent
            side={side}
            align={align}
            style={{ minWidth: 0, maxWidth: "var(--radix-popover-content-available-width)" }}
            aria-label="Staging connection preview"
          >
            <p>Staging connection</p>
            <p>12 versions synchronized. Read access belongs to the Platform team.</p>
          </UI.PopoverContent>
        </UI.Popover>
      ))}
    </div>
  );
}
