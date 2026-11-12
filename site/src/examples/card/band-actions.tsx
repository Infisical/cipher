import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import { Input } from "@infisical/cipher/ui/input";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" title="Members">
            12 members, 3 pending invites.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"no action"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Members"
            action={
              <Button variant="outline" size="xs" icon="plus">
                Invite
              </Button>
            }
          >
            12 members, 3 pending invites.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"xs Button"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Members"
            action={
              <Input size="xs" icon="search" placeholder="Search" aria-label="Search members" />
            }
          >
            12 members, 3 pending invites.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"xs search Input"}</figcaption>
      </figure>
    </div>
  );
}
