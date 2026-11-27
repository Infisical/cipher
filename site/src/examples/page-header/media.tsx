import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Media } from "@infisical/cipher/ui/item";
import { PageHeader } from "@infisical/cipher/ui/page-header";

import { placeholderMedia } from "../placeholder-media";

const logo = <Media size="md">{placeholderMedia.square}</Media>;
const smallLogo = (
  <img
    src={`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#1F6FEB"/></svg>')}`}
    width={24}
    height={24}
    alt=""
  />
);
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
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "App connections", href: "#page-header" }]}
          media={smallLogo}
          title="GitHub"
          description="Syncs 42 secrets from payments-api every 15 minutes."
          actions={
            <Button variant="outline" icon="sync">
              Sync now
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">
          {"A 24px logo centers in the media box"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full max-w-[390px] min-w-0 flex-col gap-3">
        <PageHeader
          breadcrumb={[{ label: "App connections", href: "#page-header" }]}
          media={smallLogo}
          title="GitHub"
          description="Syncs 42 secrets from payments-api every 15 minutes."
          actions={
            <Button variant="outline" icon="sync">
              Sync now
            </Button>
          }
        />
        <figcaption className="text-muted-foreground text-xs">{"A 24px logo at 390px"}</figcaption>
      </figure>
    </div>
  );
}
