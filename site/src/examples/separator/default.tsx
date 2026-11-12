import { Separator } from "@infisical/cipher/ui/separator";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <p>Connection settings</p>
          <Separator />
          <p>Access settings</p>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"horizontal"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Separator label="or" />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"labelled"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex h-6 items-stretch gap-4">
            <span>Staging</span>
            <Separator orientation="vertical" />
            <span>Production</span>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"vertical"}</figcaption>
      </figure>
    </div>
  );
}
