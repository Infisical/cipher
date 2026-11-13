import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Enterprise license"
            description={
              <span className="inline-flex flex-wrap items-center gap-2">
                <Badge tone="ok">Active</Badge>
                <span>Renews on Mar 1, 2027</span>
              </span>
            }
            action={
              <Button variant="outline" size="xs">
                Manage
              </Button>
            }
          >
            250 seats, 182 in use.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed, element description with a badge"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            title="Usage"
            description={
              <>
                Counted since the last renewal.{" "}
                <a href="#card" className="underline underline-offset-2">
                  How usage is counted
                </a>
              </>
            }
          >
            1,204 machine identities this month.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"plain, description with a link"}</figcaption>
      </figure>
    </div>
  );
}
