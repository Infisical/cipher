import { Inline } from "@infisical/cipher/ui/layout";
import { Heading, StatusText } from "@infisical/cipher/ui/text";
import { TooltipText } from "@infisical/cipher/ui/tooltip";

export default function Status() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="ok" icon="check-c">
            Signed in
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"ok"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText icon="info">Never signed in</StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"neutral"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="warn" icon="alert">
            No auth method
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"warn"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText tone="bad" icon="lock">
            Universal Auth locked out
          </StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"bad"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <StatusText loading>Submitting</StatusText>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"loading"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Inline gap={24} align="baseline">
            <Heading level={3} size="display">
              1,204
            </Heading>
            <Heading level={3} size="display">
              <StatusText size="sm" loading>
                Counting
              </StatusText>
            </Heading>
          </Inline>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"size sm inside a display Heading"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <TooltipText asChild content="Expires on Dec 1, 2026 at 09:00 UTC">
            <StatusText tone="warn">Expires in 3 days</StatusText>
          </TooltipText>
          <TooltipText
            asChild
            content="Rotation for DATABASE_CONNECTION_STRING_FOR_THE_PRIMARY_EU_WEST_1_REPLICA failed twice"
          >
            <StatusText tone="bad">
              Rotation failed for the primary EU West 1 replica connection string
            </StatusText>
          </TooltipText>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"no icon, focusable for a tooltip"}
        </figcaption>
      </figure>
    </div>
  );
}
