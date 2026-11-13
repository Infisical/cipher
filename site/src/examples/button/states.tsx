import { Button } from "@infisical/cipher/ui/button";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button loading={false}>Save changes</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Idle"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button loading>Save changes</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="outline" icon="plus" loading>
            Add connection
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading with icon"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button variant="accent" loading loadingLabel="Saving">
            Save changes
          </Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Loading label"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button disabled>Save changes</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
          <Button disabledReason="Only project admins can rotate this key.">Rotate key</Button>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Disabled with reason"}</figcaption>
      </figure>
    </div>
  );
}
