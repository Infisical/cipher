import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card, CardLink } from "@infisical/cipher/ui/card";
import { Media } from "@infisical/cipher/ui/item";
import { Meta } from "@infisical/cipher/ui/text";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Plan"
            badges={
              <Badge tone="info" size="sm">
                Enterprise
              </Badge>
            }
          >
            250 seats, 182 in use.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"framed"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title="Secrets Management"
            badges={
              <>
                <Badge tone="info" size="sm">
                  Enterprise
                </Badge>
                <Badge tone="soft" size="sm">
                  Trial
                </Badge>
              </>
            }
            action={
              <Button variant="outline" size="xs">
                Manage
              </Button>
            }
          >
            Renews on Mar 1, 2027.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"framed, two badges and an action"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            title="Secret Scanning"
            badges={<Badge tone="bad">Deprecated</Badge>}
            description="Scans repositories for leaked credentials."
            action={
              <Button variant="outline" size="xs">
                Edit
              </Button>
            }
          >
            3 plans, 41 accounts.
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"plain, with description and action"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card
            variant="framed"
            title={<CardLink link={{ href: "#/components/card" }}>Privileged Access</CardLink>}
            badges={
              <>
                <Badge tone="info">Add-on</Badge>
                <Badge tone="ok">Enterprise</Badge>
              </>
            }
            description="Just-in-time access to databases and servers."
            footer={
              <>
                <Meta mono={false}>Attaches to plans</Meta>
                <Button variant="outline" size="xs">
                  Edit
                </Button>
              </>
            }
          >
            <div className="flex items-center gap-3">
              <Media icon="shield" />
              <span>Sessions are recorded and kept for 90 days.</span>
            </div>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"framed, CardLink title: the badges sit under the link overlay, Edit keeps its click"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-start gap-3">
          <div className="w-72 max-w-full min-w-0">
            <Card
              title="A long product name that has to wrap onto a second line"
              badges={<Badge tone="info">Enterprise</Badge>}
            >
              The badge follows the title and wraps under it when the line is full.
            </Card>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"plain, narrow, long title"}
        </figcaption>
      </figure>
    </div>
  );
}
