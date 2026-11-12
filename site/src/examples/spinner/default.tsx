import { Spinner } from "@infisical/cipher/ui/spinner";

export default function Example() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-6">
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Spinner />
          </div>
          <figcaption className="text-muted-foreground text-xs">{"inline"}</figcaption>
        </figure>
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <Spinner size="base" label="Loading connections" />
          </div>
          <figcaption className="text-muted-foreground text-xs">{"base"}</figcaption>
        </figure>
      </div>
      <div className="grid w-full min-w-0 grid-cols-[repeat(auto-fit,minmax(min(100%,8rem),1fr))] items-start justify-items-center gap-x-6 gap-y-8">
        <figure className="m-0 flex w-full min-w-0 flex-col items-center gap-3 text-center">
          <div className="flex min-h-8 w-full min-w-0 flex-col items-center gap-3">
            <div className="-mt-5 -mb-10">
              <Spinner
                size="page"
                className="w-fit"
                label="Loading connections"
                description="Fetching provider configuration"
              />
            </div>
          </div>
          <figcaption className="text-muted-foreground text-xs">{"page"}</figcaption>
        </figure>
      </div>
    </div>
  );
}
