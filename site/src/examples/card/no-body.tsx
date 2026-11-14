import { Button } from "@infisical/cipher/ui/button";
import { Card } from "@infisical/cipher/ui/card";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-x-6 gap-y-8 md:grid-cols-3">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="plain"
          title="Secrets cache"
          description="Cached secrets are served for up to 60 seconds after they change."
          footer={
            <>
              <span>Last cleared 2 hours ago</span>
              <Button variant="outline" size="sm">
                Clear cache
              </Button>
            </>
          }
        />
        <figcaption className="text-muted-foreground text-xs">{"plain"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="framed"
          title="Secrets cache"
          hint="Cached secrets are served for up to 60 seconds after they change."
          footer={
            <>
              <span>Last cleared 2 hours ago</span>
              <Button variant="outline" size="sm">
                Clear cache
              </Button>
            </>
          }
        />
        <figcaption className="text-muted-foreground text-xs">{"framed, inset footer"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <Card
          variant="framed"
          title="Secrets cache"
          hint="Cached secrets are served for up to 60 seconds after they change."
          footerPlacement="frame"
          footer={
            <>
              <span>Last cleared 2 hours ago</span>
              <Button variant="outline" size="sm">
                Clear cache
              </Button>
            </>
          }
        />
        <figcaption className="text-muted-foreground text-xs">{"framed, frame footer"}</figcaption>
      </figure>
    </div>
  );
}
