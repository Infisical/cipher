import { Button } from "@infisical/cipher/ui/button";
import { StatCard } from "@infisical/cipher/ui/stat-card";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] items-start gap-x-4 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <StatCard label="Recent audit events" value="0" icon="history" loading />
        <figcaption className="text-muted-foreground text-xs">{"loading"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <StatCard label="Recent audit events" value="0" icon="history" error="Couldn't load" />
        <figcaption className="text-muted-foreground text-xs">{"error"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <StatCard
          label="In grace"
          value="12"
          icon="clock"
          tone="warn"
          delta="-3"
          trend="down"
          deltaTone="ok"
          note="Past period, awaiting billing"
        />
        <figcaption className="text-muted-foreground text-xs">
          {"warn icon, a drop that is good news"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <StatCard
          label="Trials ending soon"
          value="5"
          icon="calendar"
          delta="0"
          note={
            <Button variant="link" size="sm" asChild>
              <a href="#/components/stat-card">2 within 3 days</a>
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"flat, a link as the note"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <StatCard
          variant="plain"
          label="Machine identities"
          value="1,204"
          note="This billing period"
        />
        <figcaption className="text-muted-foreground text-xs">{"plain"}</figcaption>
      </figure>
    </div>
  );
}
