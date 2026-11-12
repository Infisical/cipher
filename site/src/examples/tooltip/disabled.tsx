import { Button } from "@infisical/cipher/ui/button";
import { Tooltip, TooltipProvider } from "@infisical/cipher/ui/tooltip";

const reason = "Only project admins can export secrets.";

export default function Example() {
  return (
    <TooltipProvider>
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Button variant="outline" icon="download" disabledReason={reason}>
              Export
            </Button>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"Blocked: hover or Tab shows why"}
          </figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Tooltip content="Export secrets">
              <Button variant="outline" icon="download">
                Export
              </Button>
            </Tooltip>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"Enabled: the label tooltip"}
          </figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Button variant="outline" icon="download" loading>
              Export
            </Button>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"Pending: loading, no tooltip"}
          </figcaption>
        </figure>
      </div>
    </TooltipProvider>
  );
}
