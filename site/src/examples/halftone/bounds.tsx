import { hueScope } from "@infisical/cipher/lib/hue";
import { Card, CardLink } from "@infisical/cipher/ui/card";
import { Halftone } from "@infisical/cipher/ui/halftone";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          {...hueScope(113.8)}
          title={
            <CardLink link={{ href: "#/components/halftone" }}>
              Secrets Management
            </CardLink>
          }
          description="Store, sync, and rotate secrets across environments."
          footer="52 secrets"
          backdrop={<Halftone bounds="header" ambient seed="secret-manager" />}
        />
        <figcaption className="text-muted-foreground text-xs">
          {
            "bounds header, ambient: fills the header, clear of the footer, and grows outward on hover"
          }
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          {...hueScope(250)}
          title={
            <CardLink link={{ href: "#/components/halftone" }}>
              Secrets synced
            </CardLink>
          }
          description="1,284 in the last 30 days"
          backdrop={<Halftone reveal="hover" size={16} seed="synced" />}
        />
        <figcaption className="text-muted-foreground text-xs">
          {
            "reveal hover, size 16: nothing at rest, the corner grows out on hover"
          }
        </figcaption>
      </figure>
    </div>
  );
}
