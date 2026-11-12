import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";
import {
  Detail,
  DetailGroup,
  DetailGroupHeader,
  DetailLabel,
  DetailValue
} from "@infisical/cipher/ui/detail";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed" title="Gateway details">
            <DetailGroup>
              <DetailGroupHeader
                action={
                  <Button variant="ghost" size="xs" icon="settings">
                    Edit
                  </Button>
                }
              >
                General
              </DetailGroupHeader>
              <Detail>
                <DetailLabel>ID</DetailLabel>
                <DetailValue>
                  <code>3f8b2c1e-9d4a-4e7b-a6c2-5b1d0f9e8a77</code>
                </DetailValue>
              </Detail>
              <Detail>
                <DetailLabel>Name</DetailLabel>
                <DetailValue>
                  eu-west-production-gateway-with-a-very-long-unbroken-identifier
                </DetailValue>
              </Detail>
              <Detail>
                <DetailLabel>Status</DetailLabel>
                <DetailValue>
                  <Badge tone="ok" dot>
                    Healthy
                  </Badge>
                </DetailValue>
              </Detail>
              <DetailGroupHeader
                action={
                  <Button variant="ghost" size="xs" icon="settings" disabled>
                    Edit
                  </Button>
                }
              >
                Authentication
              </DetailGroupHeader>
              <Detail>
                <DetailLabel>Machine identity</DetailLabel>
                <DetailValue>None</DetailValue>
              </Detail>
            </DetailGroup>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Groups with headers and an edit action"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed">
            <Detail>
              <DetailLabel>Created</DetailLabel>
              <DetailValue>Oct 12, 2026, 09:41</DetailValue>
            </Detail>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Loose details, no group"}
        </figcaption>
      </figure>
    </div>
  );
}
