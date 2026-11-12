import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="outline">Save changes</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"default, sm"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button size="md" variant="outline">
            Save changes
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"md"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button size="lg" variant="outline">
            Save changes
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"lg"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button size="icon" variant="outline" icon="settings" iconOnly aria-label="Settings" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"icon"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button size="icon-lg" variant="outline" icon="settings" iconOnly aria-label="Settings" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"icon-lg"}</figcaption>
      </figure>
    </div>
  );
}
