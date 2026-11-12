import { Button } from "@infisical/cipher/ui/button";
import { Item, Media, Tile } from "@infisical/cipher/ui/item";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <figure key={variant} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Item
              variant={variant}
              title="Deployment service"
              description="Read access to staging"
            />
          </div>
          <figcaption className="text-muted-foreground text-xs">{variant}</figcaption>
        </figure>
      ))}
      {(
        [
          ["default", "default, md"],
          ["sm", "sm"],
          ["xs", "xs"]
        ] as const
      ).map(([size, label]) => (
        <figure key={size} className="m-0 flex w-full min-w-0 flex-col gap-3">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
            <Item size={size} title="Deployment service" description="Read access to staging" />
          </div>
          <figcaption className="text-muted-foreground text-xs">{label}</figcaption>
        </figure>
      ))}
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Item
            title="applications/staging/services/payment-processing/configuration"
            description="Versions synchronized successfully"
            resolved
            truncate={false}
            mono
            actionsPlacement="below"
            actions={
              <Button asChild variant="outline">
                <a href="#code">View configuration guide</a>
              </Button>
            }
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Resolved, full text"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Tile
            title="Managed vault"
            description="Connection managed by the organization"
            disabled
            selected={false}
          />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled selection"}</figcaption>
      </figure>
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
        {(["ok", "warn", "bad", "info"] as const).map((tone) => (
          <figure
            key={tone}
            className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center"
          >
            <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
              <Media tone={tone} icon="lock" size="sm" />
            </div>
            <figcaption className="text-muted-foreground text-xs">{tone}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
