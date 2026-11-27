import { Badge } from "@infisical/cipher/ui/badge";
import { Button } from "@infisical/cipher/ui/button";

const lastUsed = (
  <Badge tone="accent" size="sm">
    Last used
  </Badge>
);

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="outline" size="md" cornerBadge={lastUsed}>
            Continue with Google
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"outline with a Last used Badge"}
        </figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="accent" size="lg" cornerBadge={lastUsed}>
            Continue with email
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">
          {"accent with an accent Badge"}
        </figcaption>
      </figure>
    </div>
  );
}
