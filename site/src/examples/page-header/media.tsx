import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Media } from "@infisical/cipher/ui/item";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import { placeholderMedia } from "../placeholder-media";

const logo = <Media size="md">{placeholderMedia.square}</Media>;
const longTitle = "aws-secrets-manager-payments-settlement-eu-west-production";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "App connections", href: "#page-header" }]}
          media={logo}
          title={longTitle}
          badges={<Badge tone="ok">Connected</Badge>}
          description="Syncs 42 secrets from payments-api every 15 minutes."
          actions={
            <Button variant="outline" icon="sync">
              Sync now
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"A wide header keeps the media beside a long title"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "App connections", href: "#page-header" }]}
          media={logo}
          title="GitHub"
          description="Syncs 42 secrets from payments-api every 15 minutes."
          actions={
            <Button variant="outline" icon="sync">
              Sync now
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"At 390px the media stays while the title fits"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "App connections", href: "#page-header" }]}
          media={logo}
          title={longTitle}
          badges={<Badge tone="ok">Connected</Badge>}
          description="Syncs 42 secrets from payments-api every 15 minutes."
          actions={
            <Button variant="outline" icon="sync">
              Sync now
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"At 390px the media drops before the title would be cut"}
        </figcaption>
      </figure>
    </div>
  );
}
