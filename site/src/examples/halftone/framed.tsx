import { Button } from "@infisical/cipher/ui/button";
import { Card, CardContent, CardHeader, CardLink, CardTitle } from "@infisical/cipher/ui/card";
import { Halftone } from "@infisical/cipher/ui/halftone";
import { hueScope } from "@infisical/cipher/lib/hue";

export default function Example() {
  return (
    <div
      {...hueScope(250, "pop")}
      className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] items-start gap-x-6 gap-y-8"
    >
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card variant="framed" title="payments-api" backdrop={<Halftone seed="no-footer" />}>
          Card checkout and refunds.
        </Card>
        <figcaption className="text-muted-foreground text-xs">
          {"title in the band, no footer"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="framed"
          title="payments-api"
          footer="3 environments"
          backdrop={<Halftone seed="inset-footer" />}
        >
          Card checkout and refunds.
        </Card>
        <figcaption className="text-muted-foreground text-xs">{"inset footer"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card variant="framed" backdrop={<Halftone seed="composed" />}>
          <CardHeader>
            <CardTitle>payments-api</CardTitle>
          </CardHeader>
          <CardContent>Card checkout and refunds.</CardContent>
        </Card>
        <figcaption className="text-muted-foreground text-xs">
          {"composed from CardHeader and CardContent"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="framed"
          title={<CardLink link={{ href: "#/components/halftone" }}>payments-api</CardLink>}
          backdrop={<Halftone seed="linked" />}
        >
          <div className="flex items-center justify-between gap-3">
            Card checkout and refunds.
            <Button variant="outline" size="sm">
              Rotate
            </Button>
          </div>
        </Card>
        <figcaption className="text-muted-foreground text-xs">
          {"linked, with a control in the body"}
        </figcaption>
      </figure>
    </div>
  );
}
