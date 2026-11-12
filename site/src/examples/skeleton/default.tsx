import { Skeleton } from "@infisical/cipher/ui/skeleton";

export default function Example() {
  return (
    <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-x-6 gap-y-8">
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <Skeleton lines={3} />
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Text lines"}</figcaption>
      </figure>
      <figure className="m-0 flex w-full min-w-0 flex-col gap-3">
        <div className="flex min-h-8 w-full min-w-0 flex-col items-stretch gap-3">
          <div className="flex w-full items-start gap-3">
            <Skeleton width={32} height={32} />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton width="45%" height={14} />
              <Skeleton lines={2} height={12} />
            </div>
          </div>
        </div>
        <figcaption className="text-muted-foreground text-xs">{"Avatar and text"}</figcaption>
      </figure>
    </div>
  );
}
