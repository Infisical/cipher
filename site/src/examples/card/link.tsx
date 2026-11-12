import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";
import { Card, CardLink } from "@infisical/cipher/ui/card";
import { Icon } from "@infisical/cipher/ui/icon";
import { SmallText } from "@infisical/cipher/ui/text";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed">
            <div className="flex items-start gap-3">
              <Icon name="apps" size="var(--v4-size-icon-xl)" className="shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <CardLink
                  link={{ href: "/design-system/components/data-display/detail" }}
                >
                  Detail
                </CardLink>
                <SmallText muted>
                  Stacked label and value pairs for the details of one resource.
                </SmallText>
                <div className="flex items-center gap-2">
                  <Badge tone="soft">Data display</Badge>
                  <Button variant="link" size="sm" asChild>
                    <a href="#row-link">Compare with RowLink</a>
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-row"
                icon="copy"
                iconOnly
                onClick={() => navigator.clipboard.writeText("detail")}
              >
                Copy the id of Detail
              </Button>
            </div>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Whole card opens Detail; the copy button and docs link keep their own click"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Card variant="framed">
            <div className="flex items-start gap-3">
              <Icon name="apps" size="var(--v4-size-icon-xl)" className="shrink-0" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <CardLink
                  link={{ href: "/design-system/components/data-display/detail" }}
                  disabled
                >
                  Unreleased page
                </CardLink>
                <SmallText muted>Opens once the page ships.</SmallText>
              </div>
            </div>
          </Card>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"Disabled: no href, no overlay"}
        </figcaption>
      </figure>
    </div>
  );
}
