import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button icon="plus">Add connection</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Leading icon"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="outline" iconRight="chev-right" asChild>
            <a href="#pagination">Continue</a>
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Trailing icon"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="ghost" size="icon" icon="eye" iconOnly aria-label="Show preview" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Icon only"}</figcaption>
      </figure>
    </div>
  );
}
