import { Skeleton } from "@infisical/cipher/ui/skeleton";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Skeleton lines={1} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"One line"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Skeleton lines={3} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Three lines"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Skeleton lines={5} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Longer block"}</figcaption>
      </figure>
    </div>
  );
}
