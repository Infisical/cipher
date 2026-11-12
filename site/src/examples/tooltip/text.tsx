import { StatusText } from "@infisical/cipher/ui/text";
import { TooltipProvider, TooltipText } from "@infisical/cipher/ui/tooltip";

export default function Example() {
  return (
    <TooltipProvider>
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <p className="text-sm">
              Last rotated <TooltipText content="2026-10-29 14:02 UTC">7 days ago</TooltipText>
            </p>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"Plain text"}</figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <TooltipText
              asChild
              content="Auto-scan is disabled. Pushes to this repository do not trigger a scan."
            >
              <StatusText icon="clock">Paused</StatusText>
            </TooltipText>
          </div>
          <figcaption className="text-muted-foreground text-xs">
            {"StatusText through asChild"}
          </figcaption>
        </figure>
      </div>
    </TooltipProvider>
  );
}
