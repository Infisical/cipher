import { Button } from "@infisical/cipher/ui/button";
import { Tooltip, TooltipProvider } from "@infisical/cipher/ui/tooltip";

const placements = [
  { side: "top", align: "start" },
  { side: "right", align: "center" },
  { side: "bottom", align: "end" },
  { side: "left", align: "center" }
] as const;
export default function Example() {
  return (
    <TooltipProvider>
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
        {placements.map(({ side, align }) => (
          <figure
            key={side}
            className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
          >
            <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
              <Tooltip side={side} align={align} content="Connection status">
                <Button variant="outline">align {align}</Button>
              </Tooltip>
            </div>
            <figcaption className="text-muted-foreground text-xs">{side}</figcaption>
          </figure>
        ))}
      </div>
    </TooltipProvider>
  );
}
